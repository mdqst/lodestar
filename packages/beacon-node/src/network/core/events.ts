import EventEmitter from "node:events";
import {ResponseIncoming, ResponseOutgoing} from "@lodestar/reqresp";
import {AsyncIterableEventBus, IteratorEvent, RequestEvent} from "../../util/asyncIterableToEvents.js";
import {StrictEventEmitterSingleArg} from "../../util/strictEvents.js";
import {EventDirection} from "../../util/workerEvents.js";
import {IncomingRequestArgs, OutgoingRequestArgs} from "../reqresp/types.js";

export enum ReqRespBridgeEvent {
  /** "reqresp.outgoingRequest" */
  outgoingRequest = 0,
  /** "reqresp.outgoingResponse" */
  outgoingResponse = 1,
  /** "reqresp.incomingRequest" */
  incomingRequest = 2,
  /** "reqresp.incomingResponse" */
  incomingResponse = 3,
}

export type ReqRespBridgeEventData = {
  [ReqRespBridgeEvent.outgoingRequest]: RequestEvent<OutgoingRequestArgs>;
  [ReqRespBridgeEvent.outgoingResponse]: IteratorEvent<ResponseOutgoing>;
  [ReqRespBridgeEvent.incomingRequest]: RequestEvent<IncomingRequestArgs>;
  [ReqRespBridgeEvent.incomingResponse]: IteratorEvent<ResponseIncoming>;
};

export const ReqRespBridgeEventNames: Record<ReqRespBridgeEvent, string> = {
  [ReqRespBridgeEvent.outgoingRequest]: "reqresp.outgoingRequest",
  [ReqRespBridgeEvent.outgoingResponse]: "reqresp.outgoingResponse",
  [ReqRespBridgeEvent.incomingRequest]: "reqresp.incomingRequest",
  [ReqRespBridgeEvent.incomingResponse]: "reqresp.incomingResponse",
};

type IReqRespBridgeEventBus = StrictEventEmitterSingleArg<ReqRespBridgeEventData>;

export class ReqRespBridgeEventBus extends (EventEmitter as {new (): IReqRespBridgeEventBus}) {}

// NOTE: If the same event is on this two arrays it can create an infinite cycle
export const reqRespBridgeEventDirection: Record<ReqRespBridgeEvent, EventDirection> = {
  [ReqRespBridgeEvent.outgoingRequest]: EventDirection.mainToWorker,
  [ReqRespBridgeEvent.outgoingResponse]: EventDirection.mainToWorker,
  [ReqRespBridgeEvent.incomingRequest]: EventDirection.workerToMain,
  [ReqRespBridgeEvent.incomingResponse]: EventDirection.workerToMain,
};

export function getReqRespBridgeReqEvents(
  events: IReqRespBridgeEventBus
): AsyncIterableEventBus<OutgoingRequestArgs, ResponseIncoming> {
  return {
    emitRequest: (data) => events.emit(ReqRespBridgeEvent.outgoingRequest, data),
    emitResponse: (data) => events.emit(ReqRespBridgeEvent.incomingResponse, data),
    onRequest: (cb) => events.on(ReqRespBridgeEvent.outgoingRequest, cb),
    onResponse: (cb) => events.on(ReqRespBridgeEvent.incomingResponse, cb),
  };
}

export function getReqRespBridgeRespEvents(
  events: IReqRespBridgeEventBus
): AsyncIterableEventBus<IncomingRequestArgs, ResponseOutgoing> {
  return {
    emitRequest: (data) => events.emit(ReqRespBridgeEvent.incomingRequest, data),
    emitResponse: (data) => events.emit(ReqRespBridgeEvent.outgoingResponse, data),
    onRequest: (cb) => events.on(ReqRespBridgeEvent.incomingRequest, cb),
    onResponse: (cb) => events.on(ReqRespBridgeEvent.outgoingResponse, cb),
  };
}

export enum NetworkWorkerThreadEventType {
  /** "networkEvent" */
  networkEvent = 0,
  /** "reqRespBridgeEvents" */
  reqRespBridgeEvents = 1,
}
