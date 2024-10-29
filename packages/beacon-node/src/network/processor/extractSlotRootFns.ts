import {SlotOptionalRoot, SlotRootHex} from "@lodestar/types";
import {
  getBlockRootFromAttestationSerialized,
  getBlockRootFromSignedAggregateAndProofSerialized,
  getSlotFromAttestationSerialized,
  getSlotFromSignedAggregateAndProofSerialized,
  getSlotFromBlobSidecarSerialized,
  getSlotFromSignedBeaconBlockSerialized,
} from "../../util/sszBytes.js";
import {GossipType} from "../gossip/index.js";
import {ExtractSlotRootFns} from "./types.js";

/**
 * Extract the slot and block root of a gossip message form serialized data.
 * Only applicable for beacon_attestation and beacon_aggregate_and_proof topics.
 */
export function createExtractBlockSlotRootFns(): ExtractSlotRootFns {
  return {
    [GossipType.beacon_attestation]: (data: Uint8Array, extractRoot: boolean): SlotOptionalRoot | null => {
      const slot = getSlotFromAttestationSerialized(data);
      if (slot === null) {
        return null;
      }

      if (extractRoot) {
        const root = getBlockRootFromAttestationSerialized(data);
        if (root === null) {
          return null;
        }

        return {slot, root};
      }

      return {slot};
    },
    [GossipType.beacon_aggregate_and_proof]: (data: Uint8Array, extractRoot: boolean): SlotOptionalRoot | null => {
      const slot = getSlotFromSignedAggregateAndProofSerialized(data);
      if (slot === null) {
        return null;
      }

      if (extractRoot) {
        const root = getBlockRootFromSignedAggregateAndProofSerialized(data);

        if (root === null) {
          return null;
        }

        return {slot, root};
      }

      return {slot};
    },
    [GossipType.beacon_block]: (data: Uint8Array): SlotOptionalRoot | null => {
      const slot = getSlotFromSignedBeaconBlockSerialized(data);

      if (slot === null) {
        return null;
      }
      return {slot};
    },
    [GossipType.blob_sidecar]: (data: Uint8Array): SlotOptionalRoot | null => {
      const slot = getSlotFromBlobSidecarSerialized(data);

      if (slot === null) {
        return null;
      }
      return {slot};
    },
  };
}
