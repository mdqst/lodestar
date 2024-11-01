import {Slot} from "@lodestar/types";
import {Logger} from "@lodestar/logger";
import {computeEpochAtSlot} from "@lodestar/state-transition";
import {formatBytes, measure} from "@lodestar/utils";
import {HistoricalStateRegenMetrics, IStateDiffCodec, RegenErrorType} from "../types.js";
import {IBeaconDb} from "../../../db/interface.js";
import {HierarchicalLayers} from "./hierarchicalLayers.js";
import {getSnapshotStateArchiveWithFallback} from "./snapshot.js";
import {applyDiffArchive, getLastStoredStateArchive} from "./stateArchive.js";
import {StateArchive, StateArchiveSSZType} from "../../../db/repositories/hierarchicalStateArchive.js";

export async function getDiffStateArchive(
  slot: Slot,
  {
    db,
    metrics,
    logger,
    hierarchicalLayers,
    codec,
  }: {
    db: IBeaconDb;
    metrics?: HistoricalStateRegenMetrics;
    logger?: Logger;
    hierarchicalLayers: HierarchicalLayers;
    codec: IStateDiffCodec;
  }
): Promise<{stateArchive: StateArchive | null; diffSlots: Slot[]}> {
  const epoch = computeEpochAtSlot(slot);
  const {snapshotSlot, diffSlots} = hierarchicalLayers.getArchiveLayers(slot);
  let expectedSnapshotSlot = snapshotSlot;

  if (diffSlots.length < 1) {
    logger?.error("Error detecting the diff layers", {slot, diffSlots: diffSlots.join(",")});
    return {diffSlots, stateArchive: null};
  }

  const snapshotArchive = await getSnapshotStateArchiveWithFallback({
    slot: expectedSnapshotSlot,
    db,
    fallbackTillSlot: hierarchicalLayers.getPreviousSlotForLayer(expectedSnapshotSlot - 1, 0),
  }).then((state) => {
    if (!state) return getLastStoredStateArchive({db, snapshot: true});

    return null;
  });

  if (!snapshotArchive) {
    logger?.error("Missing the snapshot state", {snapshotSlot: expectedSnapshotSlot});
    metrics?.regenErrorCount.inc({reason: RegenErrorType.loadState});
    return {diffSlots, stateArchive: null};
  }

  const availableSnapshotSlot = snapshotArchive.slot;

  if (availableSnapshotSlot >= slot) {
    logger?.debug("Found snapshot at higher or same slot", {
      expectedSnapshotSlot,
      availableSnapshotSlot,
    });
    return {diffSlots, stateArchive: null};
  }

  if (availableSnapshotSlot !== expectedSnapshotSlot) {
    // Possibly because of checkpoint sync
    logger?.warn("Last archived snapshot is not at expected slot", {
      expectedSnapshotSlot,
      availableSnapshotSlot: snapshotArchive.slot,
    });
    expectedSnapshotSlot = snapshotArchive.slot;
  }

  // Get all diffs except the first one which was a snapshot layer
  const diffArchives = await Promise.all(
    diffSlots.map((s) => measure(metrics?.loadDiffStateTime, () => db.hierarchicalStateArchiveRepository.get(s)))
  );

  const nonEmptyDiffs = diffArchives.filter(Boolean) as StateArchive[];

  if (nonEmptyDiffs.length < diffSlots.length) {
    logger?.warn("Missing some diff states", {
      epoch,
      slot,
      snapshotSlot: expectedSnapshotSlot,
      diffPath: diffSlots.join(","),
      availableDiffs: nonEmptyDiffs.map((d) => d.slot).join(","),
    });
    metrics?.regenErrorCount.inc({reason: RegenErrorType.loadState});
  }

  try {
    logger?.verbose("Replaying state diffs", {
      epoch,
      slot,
      snapshotSlot: expectedSnapshotSlot,
      diffPath: diffSlots.join(","),
      availableDiffs: nonEmptyDiffs.map((d) => d.slot).join(","),
    });

    let activeStateArchive = snapshotArchive;

    for (const intermediateStateArchive of nonEmptyDiffs) {
      logger?.verbose("Applying state diff", {
        activeSlot: intermediateStateArchive.slot,
        activeStateSize: formatBytes(StateArchiveSSZType.serialize(activeStateArchive).byteLength),
        diffSlot: intermediateStateArchive.slot,
        diffStateSize: formatBytes(StateArchiveSSZType.serialize(intermediateStateArchive).byteLength),
      });
      activeStateArchive = applyDiffArchive(activeStateArchive, intermediateStateArchive, codec);
    }

    if (activeStateArchive.partialState.byteLength === 0 || activeStateArchive.balances.byteLength === 0) {
      throw new Error("Some error during applying diffs");
    }

    return {diffSlots, stateArchive: activeStateArchive};
  } catch (err) {
    logger?.error(
      "Can not compute the diff state",
      {epoch, slot, snapshotSlot: expectedSnapshotSlot, diffPath: diffSlots.join(",")},
      err as Error
    );
    metrics?.regenErrorCount.inc({reason: RegenErrorType.loadState});
    return {diffSlots, stateArchive: null};
  }
}
