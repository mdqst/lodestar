import {Slot} from "@lodestar/types";
import {Logger} from "@lodestar/logger";
import {computeEpochAtSlot} from "@lodestar/state-transition";
import {formatBytes, measure} from "@lodestar/utils";
import {HistoricalStateRegenMetrics, IStateDiffCodec, RegenErrorType} from "../types.js";
import {IBeaconDb} from "../../../db/interface.js";
import {HierarchicalLayers, Layers} from "./hierarchicalLayers.js";
import {getSnapshotStateArchive, searchSnapshotStateArchive} from "./snapshot.js";
import {applyDiffArchive} from "./stateArchive.js";
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
): Promise<{stateArchive: StateArchive | null; layers: Layers}> {
  const epoch = computeEpochAtSlot(slot);
  const {snapshotSlot, diffSlots} = hierarchicalLayers.getArchiveLayers(slot);
  const expectedSnapshotSlot = snapshotSlot;

  const snapshotArchive = await getSnapshotStateArchive(expectedSnapshotSlot, db).then(
    (state) => state ?? searchSnapshotStateArchive(Math.max(expectedSnapshotSlot - 1, 0), 0, db)
  );

  if (!snapshotArchive) {
    logger?.error("Missing the snapshot state", {snapshotSlot: expectedSnapshotSlot});
    metrics?.regenErrorCount.inc({reason: RegenErrorType.loadState});
    return {layers: {snapshotSlot, diffSlots}, stateArchive: null};
  }

  const availableSnapshotSlot = snapshotArchive.slot;

  if (availableSnapshotSlot !== expectedSnapshotSlot) {
    // Possibly because of checkpoint sync
    logger?.warn("Last archived snapshot is not at expected slot", {
      expectedSnapshotSlot,
      availableSnapshotSlot: snapshotArchive.slot,
    });
  }

  if (availableSnapshotSlot >= slot) {
    logger?.debug("Found snapshot at higher or same slot", {
      expectedSnapshotSlot,
      availableSnapshotSlot,
    });
    return {layers: {diffSlots, snapshotSlot: availableSnapshotSlot}, stateArchive: snapshotArchive};
  }

  // In cases when snapshot is taken during the checkpoint sync and is at higher slot than expected
  const applicableDiffs = diffSlots.filter((s) => s > availableSnapshotSlot);

  // Get all diffs except the first one which was a snapshot layer
  const diffArchives = (
    await Promise.all(
      applicableDiffs.map((s) =>
        measure(metrics?.loadDiffStateTime, () => db.hierarchicalStateArchiveRepository.get(s))
      )
    )
  ).filter(Boolean) as StateArchive[];

  // If we apply some diff with missing one, it will not fail rather result in wrong state computation
  if (diffArchives.length > 0 && diffArchives.length < applicableDiffs.length) {
    logger?.error("Missing some diff states", {
      epoch,
      slot,
      snapshotSlot: expectedSnapshotSlot,
      diffPath: diffSlots.join(","),
      availableDiffs: diffArchives.map((d) => d.slot).join(","),
    });
    metrics?.regenErrorCount.inc({reason: RegenErrorType.loadState});

    return {layers: {snapshotSlot: availableSnapshotSlot, diffSlots}, stateArchive: null};
  }

  try {
    logger?.verbose("Replaying state diffs", {
      epoch,
      slot,
      snapshotSlot: expectedSnapshotSlot,
      diffPath: diffSlots.join(","),
      availableDiffs: diffArchives.map((d) => d.slot).join(","),
    });

    let activeStateArchive = snapshotArchive;

    for (const intermediateStateArchive of diffArchives) {
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
    return {layers: {diffSlots, snapshotSlot: availableSnapshotSlot}, stateArchive: activeStateArchive};
  } catch (err) {
    logger?.error(
      "Can not compute the diff state",
      {epoch, slot, snapshotSlot: expectedSnapshotSlot, diffPath: diffSlots.join(",")},
      err as Error
    );
    metrics?.regenErrorCount.inc({reason: RegenErrorType.loadState});
    return {layers: {snapshotSlot: availableSnapshotSlot, diffSlots}, stateArchive: null};
  }
}
