import {fetch} from "cross-fetch";
import {ErrorAborted, ILogger, TimeoutError} from "@lodestar/utils";
import {ReqGeneric, RouteDef} from "../index.js";
import {stringifyQuery, urlJoin} from "./format.js";
import {Metrics} from "./metrics.js";

/** A higher default timeout, validator will sets its own shorter timeoutMs */
const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_ROUTE_ID = "unknown";
const URL_SCORE_MAX = 10;
const URL_SCORE_MIN = 0;
const URL_SCORE_DELTA_ERROR = 1;
const URL_SCORE_DELTA_SUCCESS = 1;

export class HttpError extends Error {
  status: number;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.status = status;
    this.url = url;
  }
}

export interface URLOpts {
  baseUrl: string;
  timeoutMs?: number;
  bearerToken?: string;
}

export type FetchOpts = {
  url: RouteDef["url"];
  method: RouteDef["method"];
  query?: ReqGeneric["query"];
  body?: ReqGeneric["body"];
  headers?: ReqGeneric["headers"];
  /** Optional, for metrics */
  routeId?: string;
  timeoutMs?: number;
};

export interface IHttpClient {
  baseUrl: string;
  json<T>(opts: FetchOpts): Promise<T>;
  request(opts: FetchOpts): Promise<void>;
  arrayBuffer(opts: FetchOpts): Promise<ArrayBuffer>;
}

export type HttpClientOptions = {
  baseUrl: string;
  timeoutMs?: number;
  bearerToken?: string;
  /** For fallback support, overrides baseUrl */
  urls?: URLOpts[];
  /** Return an AbortSignal to be attached to all requests */
  getAbortSignal?: () => AbortSignal | undefined;
  /** Override fetch function */
  fetch?: typeof fetch;
};

export type HttpClientModules = {
  logger?: ILogger;
  metrics?: Metrics;
};

export class HttpClient implements IHttpClient {
  private readonly globalTimeoutMs: number;
  private readonly getAbortSignal?: () => AbortSignal | undefined;
  private readonly fetch: typeof fetch;
  private readonly metrics: null | Metrics;
  private readonly logger: null | ILogger;

  private readonly urlOpts: URLOpts[] = [];
  private readonly urlScore: number[];

  get baseUrl(): string {
    return this.urlOpts[0].baseUrl;
  }

  /**
   * timeoutMs = config.params.SECONDS_PER_SLOT * 1000
   */
  constructor(opts: HttpClientOptions, {logger, metrics}: HttpClientModules = {}) {
    if (opts.baseUrl) {
      this.urlOpts.push({
        baseUrl: opts.baseUrl,
        bearerToken: opts.bearerToken,
        timeoutMs: opts.timeoutMs,
      });
    }

    if (opts.urls) {
      for (const urlOpts of opts.urls) {
        this.urlOpts.push(urlOpts);
      }
    }

    this.globalTimeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.getAbortSignal = opts.getAbortSignal;
    this.fetch = opts.fetch ?? fetch;
    this.metrics = metrics ?? null;
    this.logger = logger ?? null;
    this.urlScore = [opts.baseUrl].map(() => 0);
  }

  async json<T>(opts: FetchOpts): Promise<T> {
    return await this.requestWithBodyWithRetries<T>(opts, (res) => res.json() as Promise<T>);
  }

  async request(opts: FetchOpts): Promise<void> {
    return await this.requestWithBodyWithRetries<void>(opts, async (_res) => void 0);
  }

  async arrayBuffer(opts: FetchOpts): Promise<ArrayBuffer> {
    return await this.requestWithBodyWithRetries<ArrayBuffer>(opts, (res) => res.arrayBuffer());
  }

  private async requestWithBodyWithRetries<T>(opts: FetchOpts, getBody: (res: Response) => Promise<T>): Promise<T> {
    // Early return when no fallback URLs are setup
    if (this.urlOpts.length === 1) {
      return this.requestWithBody(this.urlOpts[0], opts, getBody);
    }

    return new Promise<T>((resolve, reject) => {
      let requestCount = 0;
      let errorCount = 0;

      // Score each URL available
      // If url[0] is good, only send to 0
      // If url[0] has errors, send to both 0, 1, etc until finding a healthy URL
      for (let i = 0; i < this.urlOpts.length; i++) {
        const urlOpts = this.urlOpts[i];
        requestCount++;

        if (requestCount > 0) {
          const routeId = opts.routeId ?? DEFAULT_ROUTE_ID;
          this.metrics?.requestToFallbacks.inc({routeId});
          this.logger?.debug("Requesting fallback URL", {routeId, baseUrl: urlOpts.baseUrl, score: this.urlScore[i]});
        }

        this.requestWithBody(urlOpts, opts, getBody).then(
          (res) => {
            this.urlScore[i] = Math.min(URL_SCORE_MAX, this.urlScore[i] + URL_SCORE_DELTA_SUCCESS);
            // Resolve immediately on success
            resolve(res);
          },
          (err) => {
            this.urlScore[i] = Math.max(URL_SCORE_MIN, this.urlScore[i] - URL_SCORE_DELTA_ERROR);

            // Reject only when all queried URLs have errored
            // TODO: Currently rejects with last error only, should join errors?
            if (++errorCount >= requestCount) {
              reject(err);
            }
          }
        );

        // Do not query URLs after a healthy URL
        if (this.urlScore[i] > URL_SCORE_MAX) {
          break;
        }
      }
    });
  }

  private async requestWithBody<T>(
    urlOpts: URLOpts,
    opts: FetchOpts,
    getBody: (res: Response) => Promise<T>
  ): Promise<T> {
    const {baseUrl, bearerToken, timeoutMs = DEFAULT_TIMEOUT_MS} = urlOpts;

    // Implement fetch timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? timeoutMs ?? this.globalTimeoutMs);

    // Attach global signal to this request's controller
    const onGlobalSignalAbort = controller.abort.bind(controller);
    const signalGlobal = this.getAbortSignal?.();
    signalGlobal?.addEventListener("abort", onGlobalSignalAbort);

    const routeId = opts.routeId ?? DEFAULT_ROUTE_ID;
    const timer = this.metrics?.requestTime.startTimer({routeId});

    try {
      const url = urlJoin(baseUrl, opts.url) + (opts.query ? "?" + stringifyQuery(opts.query) : "");

      const headers = opts.headers || {};
      if (opts.body && headers["Content-Type"] === undefined) {
        headers["Content-Type"] = "application/json";
      }
      if (bearerToken && headers["Authorization"] === undefined) {
        headers["Authorization"] = `Bearer ${bearerToken}`;
      }

      this.logger?.debug("HttpClient request", {routeId});

      const res = await this.fetch(url, {
        method: opts.method,
        headers: headers as Record<string, string>,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new HttpError(`${res.statusText}: ${getErrorMessage(errBody)}`, res.status, url);
      }

      this.logger?.debug("HttpClient response", {routeId});

      return await getBody(res);
    } catch (e) {
      this.metrics?.requestErrors.inc({routeId});

      if (isAbortedError(e as Error)) {
        if (signalGlobal?.aborted) {
          throw new ErrorAborted("REST client");
        } else if (controller.signal.aborted) {
          throw new TimeoutError("request");
        } else {
          throw Error("Unknown aborted error");
        }
      } else {
        throw e;
      }
    } finally {
      timer?.();

      clearTimeout(timeout);
      signalGlobal?.removeEventListener("abort", onGlobalSignalAbort);
    }
  }
}

function isAbortedError(e: Error): boolean {
  return e.name === "AbortError" || e.message === "The user aborted a request";
}

function getErrorMessage(errBody: string): string {
  try {
    const errJson = JSON.parse(errBody) as {message: string};
    if (errJson.message) {
      return errJson.message;
    } else {
      return errBody;
    }
  } catch (e) {
    return errBody;
  }
}
