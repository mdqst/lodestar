import {Slot} from "@lodestar/types";
import {
  getSlotFromAttestationSerialized,
  getSlotFromSignedAggregateAndProofSerialized,
  getSlotFromBlobSidecarSerialized,
  getSlotFromSignedBeaconBlockSerialized,
} from "../../util/sszBytes.js";
import {GossipType} from "../gossip/index.js";
import {ExtractSlotFns} from "./types.js";

/**
 * Extract the slot and block root of a gossip message form serialized data.
 * Only applicable for beacon_attestation and beacon_aggregate_and_proof topics.
 */
export function createExtractBlockSlotRootFns(): ExtractSlotFns {
  return {
    [GossipType.beacon_attestation]: (data: Uint8Array): Slot | null => {
      return getSlotFromAttestationSerialized(data);
    },
    [GossipType.beacon_aggregate_and_proof]: (data: Uint8Array): Slot | null => {
      return getSlotFromSignedAggregateAndProofSerialized(data);
    },
    [GossipType.beacon_block]: (data: Uint8Array): Slot | null => {
      return getSlotFromSignedBeaconBlockSerialized(data);
    },
    [GossipType.blob_sidecar]: (data: Uint8Array): Slot | null => {
      return getSlotFromBlobSidecarSerialized(data);
    },
  };
}
