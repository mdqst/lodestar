import {EventEmitter} from "node:events";
import {PeerId} from "@libp2p/interface";
import {phase0, RootHex} from "@lodestar/types";
import {BlockInput, NullBlockInput} from "../chain/blocks/types.js";
import {StrictEventEmitterSingleArg} from "../util/strictEvents.js";
import {PeerIdStr} from "../util/peerId.js";
import {EventDirection} from "../util/workerEvents.js";
import {RequestTypedContainer} from "./reqresp/ReqRespBeaconNode.js";
import {TopicIndex} from "./gossip/topic.js";
import {PeerIndex} from "./gossip/index.js";

export enum NetworkEvent {
  /** A relevant peer has connected or has been re-STATUS'd */
  peerConnected = "peer-manager.peer-connected",
  /** A peer has been disconnected */
  peerDisconnected = "peer-manager.peer-disconnected",
  reqRespRequest = "req-resp.request",
  // TODO remove this event, this is not a network-level concern, rather a chain / sync concern
  unknownBlockParent = "unknownBlockParent",
  unknownBlock = "unknownBlock",
  unknownBlockInput = "unknownBlockInput",
  newPeerIndex = "gossip.newPeerInde",
  // Network processor events
  /** (Network -> App) A gossip message is ready for validation */
  pendingGossipsubMessage = "gossip.pendingGossipsubMessage",
  /** (App -> Network) A gossip message has been validated */
  gossipMessageValidationResult = "gossip.messageValidationResult",
}

export type NetworkEventData = {
  [NetworkEvent.peerConnected]: {peer: PeerIdStr; status: phase0.Status};
  [NetworkEvent.peerDisconnected]: {peer: PeerIdStr};
  [NetworkEvent.reqRespRequest]: {request: RequestTypedContainer; peer: PeerId};
  [NetworkEvent.unknownBlockParent]: {blockInput: BlockInput; peer: PeerIdStr};
  [NetworkEvent.unknownBlock]: {rootHex: RootHex; peer?: PeerIdStr};
  [NetworkEvent.unknownBlockInput]: {blockInput: BlockInput | NullBlockInput; peer?: PeerIdStr};
  [NetworkEvent.newPeerIndex]: ExchangePeerIdIndex;
  [NetworkEvent.pendingGossipsubMessage]: ExchangeGossipsubMessage;
  [NetworkEvent.gossipMessageValidationResult]: ExchangeGossipValidationResult;
};

export const networkEventDirection: Record<NetworkEvent, EventDirection> = {
  [NetworkEvent.peerConnected]: EventDirection.workerToMain,
  [NetworkEvent.peerDisconnected]: EventDirection.workerToMain,
  [NetworkEvent.reqRespRequest]: EventDirection.none, // Only used internally in NetworkCore
  [NetworkEvent.unknownBlockParent]: EventDirection.workerToMain,
  [NetworkEvent.unknownBlock]: EventDirection.workerToMain,
  [NetworkEvent.unknownBlockInput]: EventDirection.workerToMain,
  [NetworkEvent.newPeerIndex]: EventDirection.workerToMain,
  [NetworkEvent.pendingGossipsubMessage]: EventDirection.workerToMain,
  [NetworkEvent.gossipMessageValidationResult]: EventDirection.mainToWorker,
};

export type INetworkEventBus = StrictEventEmitterSingleArg<NetworkEventData>;

export class NetworkEventBus extends (EventEmitter as {new (): INetworkEventBus}) {}

export type ExchangePeerIdIndex = {
  peerId: PeerIdStr;
  peerIndex: PeerIndex;
};

/**
 * The interface to exchange gossip messages from worker to main thread
 * This should be as lightweight as possible because it's passed through thread boundary
 */
export type ExchangeGossipsubMessage = {
  msgId: string;
  msgData: Uint8Array;
  // this is actually msgData.buffer, to transfer its data through thread boundary without structural clone
  transferList: ArrayBuffer[];
  // topic, propagationSource, seenTimestampSec
  meta: [TopicIndex, PeerIndex, number];
};

/**
 * The interface to exchange gossip validation results from main thread to worker
 */
export type ExchangeGossipValidationResult = {
  msgId: string;
  propagationSource: PeerIndex;
  // acceptance is index to TopicValidatorResult
  // we use number instead of string to reduce structural clone cost
  acceptance: number;
};
