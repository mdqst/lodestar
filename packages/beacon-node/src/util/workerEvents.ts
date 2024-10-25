import {MessagePort, Worker} from "node:worker_threads";
import {Thread} from "@chainsafe/threads";
import {Logger} from "@lodestar/logger";
import {sleep} from "@lodestar/utils";
import {Metrics} from "../metrics/metrics.js";
import {NetworkCoreWorkerMetrics} from "../network/core/metrics.js";
import {StrictEventEmitterSingleArg, TransferrableMessage} from "./strictEvents.js";
import {NetworkWorkerThreadEventType} from "../network/core/events.js";

/** Use as lightweight message as possible when passing through thread boundary to minimize structural clone cost */
export type WorkerBridgeEvent<EventData> = {
  // [NetworkWorkerThreadEventType, eventIndex, postedAt]
  meta: [number, number, number];
  data: EventData[keyof EventData];
};

export enum EventDirection {
  workerToMain,
  mainToWorker,
  /** Event not emitted through worker boundary */
  none,
}

/**
 * Bridges events from worker to main thread
 * Each event can only have one direction:
 * - worker to main
 * - main to worker
 */
export function wireEventsOnWorkerThread<EventData extends Record<string, unknown>>(
  mainEventName: NetworkWorkerThreadEventType,
  events: StrictEventEmitterSingleArg<EventData>,
  parentPort: MessagePort,
  metrics: NetworkCoreWorkerMetrics | null,
  isWorkerToMain: {[K in keyof EventData]: EventDirection}
): void {
  // Subscribe to events from main thread
  const networkEvents = Object.keys(isWorkerToMain) as (keyof EventData)[];
  parentPort.on("message", (data: WorkerBridgeEvent<EventData>) => {
    const {meta} = data;
    if (meta) {
      const [type, eventIndex, postedAt] = meta;
      const eventName = networkEvents[eventIndex];
      if (
        typeof data === "object" &&
        type === mainEventName &&
        // This check is not necessary but added for safety in case of improper implemented events
        isWorkerToMain[eventName] === EventDirection.mainToWorker
      ) {
        const networkWorkerLatency = (Date.now() - postedAt) / 1000;
        metrics?.networkWorkerWireEventsOnWorkerThreadLatency.observe(
          {eventName: eventName as string},
          networkWorkerLatency
        );
        events.emit(eventName, data.data);
      }
    }
  });

  for (const eventName of Object.keys(isWorkerToMain) as (keyof EventData)[]) {
    if (isWorkerToMain[eventName] === EventDirection.workerToMain) {
      // Pick one of the events to comply with StrictEventEmitter function signature
      events.on(eventName, (data) => {
        const workerEvent: WorkerBridgeEvent<EventData> = {
          meta: [mainEventName, networkEvents.indexOf(eventName), Date.now()],
          data,
        };
        parentPort.postMessage(workerEvent, (data as TransferrableMessage).transferList);
      });
    }
  }
}

export function wireEventsOnMainThread<EventData extends Record<string, unknown>>(
  mainEventName: NetworkWorkerThreadEventType,
  events: StrictEventEmitterSingleArg<EventData>,
  worker: Pick<Worker, "on" | "postMessage">,
  metrics: Metrics | null,
  isWorkerToMain: {[K in keyof EventData]: EventDirection}
): void {
  const networkEvents = Object.keys(isWorkerToMain) as (keyof EventData)[];
  // Subscribe to events from main thread
  worker.on("message", (data: WorkerBridgeEvent<EventData>) => {
    const {meta} = data;
    if (meta) {
      const [type, eventIndex, postedAt] = meta;
      const eventName = networkEvents[eventIndex];
      if (
        typeof data === "object" &&
        type === mainEventName &&
        // This check is not necessary but added for safety in case of improper implemented events
        isWorkerToMain[eventName] === EventDirection.workerToMain
      ) {
        const networkWorkerLatency = (Date.now() - postedAt) / 1000;
        metrics?.networkWorkerWireEventsOnMainThreadLatency.observe(
          {eventName: eventName as string},
          networkWorkerLatency
        );
        events.emit(eventName, data.data);
      }
    }
  });

  for (const eventName of Object.keys(isWorkerToMain) as (keyof EventData)[]) {
    if (isWorkerToMain[eventName] === EventDirection.mainToWorker) {
      // Pick one of the events to comply with StrictEventEmitter function signature
      events.on(eventName, (data) => {
        const workerEvent: WorkerBridgeEvent<EventData> = {
          meta: [mainEventName, networkEvents.indexOf(eventName), Date.now()],
          data,
        };
        worker.postMessage(workerEvent, (data as TransferrableMessage).transferList);
      });
    }
  }
}

export async function terminateWorkerThread({
  worker,
  retryMs,
  retryCount,
  logger,
}: {
  worker: Thread;
  retryMs: number;
  retryCount: number;
  logger?: Logger;
}): Promise<void> {
  const terminated = new Promise((resolve) => {
    Thread.events(worker).subscribe((event) => {
      if (event.type === "termination") {
        resolve(true);
      }
    });
  });

  for (let i = 0; i < retryCount; i++) {
    await Thread.terminate(worker);
    const result = await Promise.race([terminated, sleep(retryMs).then(() => false)]);

    if (result) return;

    logger?.warn("Worker thread failed to terminate, retrying...");
  }

  throw new Error(`Worker thread failed to terminate in ${retryCount * retryMs}ms.`);
}
