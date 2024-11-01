import {PubkeyIndexMap} from "@chainsafe/pubkey-index-map";
import {Slot} from "@lodestar/types";
import {computeEpochAtSlot} from "@lodestar/state-transition";
import {IStateDiffCodec, HistoricalStateStorageType, HierarchicalStateOperationOptions} from "../types.js";
import {replayBlocks} from "../utils/blockReplay.js";
import {XDelta3Codec} from "../utils/xdelta3.js";
import {getDiffStateArchive} from "../utils/diff.js";
import {stateArchiveToStateBytes} from "../utils/stateArchive.js";
import {measure} from "@lodestar/utils";

export const codec: IStateDiffCodec = new XDelta3Codec();

export async function getHistoricalState(
  slot: Slot,
  {
    stateArchiveMode,
    db,
    logger,
    config,
    metrics,
    hierarchicalLayers,
    pubkey2index,
  }: HierarchicalStateOperationOptions & {pubkey2index: PubkeyIndexMap}
): Promise<Uint8Array | null> {
  const slotType = hierarchicalLayers.getStorageType(slot, stateArchiveMode);

  return measure(metrics?.regenTime, {strategy: slotType}, async () => {
    const epoch = computeEpochAtSlot(slot);
    logger.verbose("Fetching state archive", {slotType, slot, epoch});

    switch (slotType) {
      case HistoricalStateStorageType.Full: {
        return measure(metrics?.loadSnapshotStateTime, () => {
          return db.stateArchive.getBinary(slot);
        });
      }

      case HistoricalStateStorageType.Snapshot: {
        return measure(metrics?.loadSnapshotStateTime, async () => {
          const stateArchive = await db.hierarchicalStateArchiveRepository.get(slot);
          return stateArchive ? stateArchiveToStateBytes(stateArchive, config) : null;
        });
      }
      case HistoricalStateStorageType.Diff: {
        const {stateArchive} = await getDiffStateArchive(
          {slot, skipSlotDiff: false},
          {db, metrics, logger, hierarchicalLayers: hierarchicalLayers, codec}
        );
        return stateArchive ? stateArchiveToStateBytes(stateArchive, config) : null;
      }

      case HistoricalStateStorageType.BlockReplay: {
        const {stateArchive, diffSlots} = await getDiffStateArchive(
          {slot, skipSlotDiff: false},
          {db, metrics, logger, hierarchicalLayers: hierarchicalLayers, codec}
        );

        if (!stateArchive) {
          return null;
        }

        const state = replayBlocks(
          {
            toSlot: slot,
            lastFullSlot: diffSlots[diffSlots.length - 1],
            lastFullStateBytes: stateArchiveToStateBytes(stateArchive, config),
          },
          {config, db, metrics, pubkey2index}
        );

        return state;
      }
    }
  });
}
