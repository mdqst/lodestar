import {ValueOf} from "@chainsafe/ssz";
import * as ssz from "./sszTypes.js";

export type Metadata = ValueOf<typeof ssz.Metadata>;

export type Cell = ValueOf<typeof ssz.Cell>;
export type DataColumn = ValueOf<typeof ssz.DataColumn>;
export type ExtendedMatrix = ValueOf<typeof ssz.ExtendedMatrix>;
export type KzgCommitmentsInclusionProof = ValueOf<typeof ssz.KzgCommitmentsInclusionProof>;
export type DataColumnSidecar = ValueOf<typeof ssz.DataColumnSidecar>;
export type DataColumnSidecars = ValueOf<typeof ssz.DataColumnSidecars>;

export type DataColumnIdentifier = ValueOf<typeof ssz.DataColumnIdentifier>;
export type DataColumnSidecarsByRootRequest = ValueOf<typeof ssz.DataColumnSidecarsByRootRequest>;
export type DataColumnSidecarsByRangeRequest = ValueOf<typeof ssz.DataColumnSidecarsByRangeRequest>;

export type ExecutionPayloadAndBlobsBundle = ValueOf<typeof ssz.ExecutionPayloadAndBlobsBundle>;

export type ExecutionPayload = ValueOf<typeof ssz.ExecutionPayload>;
export type ExecutionPayloadHeader = ValueOf<typeof ssz.ExecutionPayloadHeader>;

export type BeaconBlockBody = ValueOf<typeof ssz.BeaconBlockBody>;
export type BeaconBlock = ValueOf<typeof ssz.BeaconBlock>;
export type SignedBeaconBlock = ValueOf<typeof ssz.SignedBeaconBlock>;

export type BeaconState = ValueOf<typeof ssz.BeaconState>;

export type BlindedBeaconBlockBody = ValueOf<typeof ssz.BlindedBeaconBlockBody>;
export type BlindedBeaconBlock = ValueOf<typeof ssz.BlindedBeaconBlock>;
export type SignedBlindedBeaconBlock = ValueOf<typeof ssz.SignedBlindedBeaconBlock>;

export type BuilderBid = ValueOf<typeof ssz.BuilderBid>;
export type SignedBuilderBid = ValueOf<typeof ssz.SignedBuilderBid>;
export type SSEPayloadAttributes = ValueOf<typeof ssz.SSEPayloadAttributes>;

export type LightClientHeader = ValueOf<typeof ssz.LightClientHeader>;
export type LightClientBootstrap = ValueOf<typeof ssz.LightClientBootstrap>;
export type LightClientUpdate = ValueOf<typeof ssz.LightClientUpdate>;
export type LightClientFinalityUpdate = ValueOf<typeof ssz.LightClientFinalityUpdate>;
export type LightClientOptimisticUpdate = ValueOf<typeof ssz.LightClientOptimisticUpdate>;
export type LightClientStore = ValueOf<typeof ssz.LightClientStore>;

export type BlockContents = ValueOf<typeof ssz.BlockContents>;
export type SignedBlockContents = ValueOf<typeof ssz.SignedBlockContents>;
export type Contents = Omit<BlockContents, "block">;