import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {when} from "vitest-when";
import {Logger} from "@lodestar/logger";
import {IBeaconDb} from "../../../../../src/index.js";
import {getMockedBeaconDb} from "../../../../mocks/mockedBeaconDb.js";
import {getMockedLogger} from "../../../../mocks/loggerMock.js";
import {getDiffStateArchive} from "../../../../../src/chain/historicalState/utils/diff.js";
import {IStateDiffCodec} from "../../../../../src/chain/historicalState/types.js";
import {HierarchicalLayers, Layers} from "../../../../../src/chain/historicalState/utils/hierarchicalLayers.js";
import {XDelta3Codec} from "../../../../../src/chain/historicalState/utils/xdelta3.js";
import {computeStartSlotAtEpoch} from "@lodestar/state-transition";
import {StateArchive} from "../../../../../src/db/repositories/hierarchicalStateArchive.js";

const codec = new XDelta3Codec();

describe("historicalState/util", () => {
  let db: IBeaconDb;
  let logger: Logger;
  let hierarchicalLayers: HierarchicalLayers;
  let codec: IStateDiffCodec;

  beforeEach(async () => {
    db = getMockedBeaconDb();
    logger = getMockedLogger();
    hierarchicalLayers = HierarchicalLayers.fromString("10, 20, 30, 40, 50");
    codec = new XDelta3Codec();

    vi.spyOn(codec, "apply");
    vi.spyOn(codec, "compute");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getDiffState", () => {
    it("should return empty state when db is empty", async () => {
      const slot = 0;

      when(db.hierarchicalStateArchiveRepository.get).calledWith(0).thenResolve(null);
      when(db.hierarchicalStateArchiveRepository.valuesStream)
        .calledWith({gte: 0, lte: 0, reverse: true})
        .thenReturn((async function* f() {})());

      await expect(getDiffStateArchive(slot, {db, logger, hierarchicalLayers, codec})).resolves.toEqual({
        stateArchive: null,
        layers: {
          snapshotSlot: 0,
          diffSlots: [],
        },
      });
    });

    it("should not apply any diff when db is empty", async () => {
      const slot = 0;

      when(db.hierarchicalStateArchiveRepository.get).calledWith(0).thenResolve(null);
      when(db.hierarchicalStateArchiveRepository.valuesStream)
        .calledWith({gte: 0, lte: 0, reverse: true})
        .thenReturn((async function* f() {})());

      await getDiffStateArchive(slot, {db, logger, hierarchicalLayers, codec});

      expect(codec.compute).not.toBeCalled();
    });

    it("should return empty state when snapshot state is missing", async () => {
      const slot = 50;

      when(db.hierarchicalStateArchiveRepository.get).calledWith(slot).thenResolve(null);
      when(db.hierarchicalStateArchiveRepository.valuesStream)
        .calledWith({gte: 0, lte: 0, reverse: true})
        .thenReturn((async function* f() {})());

      await expect(getDiffStateArchive(slot, {db, logger, hierarchicalLayers, codec})).resolves.toEqual({
        stateArchive: null,
        layers: {
          snapshotSlot: 0,
          diffSlots: [],
        },
      });
    });

    it("should not fallback to last snapshot if given snapshot is available", async () => {
      const slot = computeStartSlotAtEpoch(50) + 1;
      const layers = hierarchicalLayers.getArchiveLayers(slot);
      const expectedSnapshotSlot = layers.snapshotSlot;
      const snapshotArchive = generateSnapshotArchive(expectedSnapshotSlot);

      when(db.hierarchicalStateArchiveRepository.get).calledWith(expectedSnapshotSlot).thenResolve(snapshotArchive);

      expect(db.hierarchicalStateArchiveRepository.valuesStream).not.toHaveBeenCalled();
      await expect(getDiffStateArchive(slot, {db, logger, hierarchicalLayers, codec})).resolves.toEqual({
        stateArchive: snapshotArchive,
        layers: {
          snapshotSlot: expectedSnapshotSlot,
          diffSlots: layers.diffSlots,
        },
      });
    });

    it("should fallback to last snapshot if given snapshot is missing", async () => {
      const slot = computeStartSlotAtEpoch(50) + 1;
      const layers = hierarchicalLayers.getArchiveLayers(slot);
      const expectedSnapshotSlot = layers.snapshotSlot;
      const snapshotSlot = expectedSnapshotSlot - 50;
      const stateArchive = generateSnapshotArchive(snapshotSlot);

      when(db.hierarchicalStateArchiveRepository.get).calledWith(expectedSnapshotSlot).thenResolve(null);
      when(db.hierarchicalStateArchiveRepository.valuesStream)
        .calledWith({gte: 0, lte: expectedSnapshotSlot - 1, reverse: true})
        .thenReturn(
          (async function* f() {
            yield stateArchive;
          })()
        );

      await expect(getDiffStateArchive(slot, {db, logger, hierarchicalLayers, codec})).resolves.toEqual({
        stateArchive: stateArchive,
        layers: {
          snapshotSlot: snapshotSlot,
          diffSlots: layers.diffSlots,
        },
      });
    });

    it("should load all diffs", async () => {
      const slot = computeStartSlotAtEpoch(70) + 1;
      const layers = hierarchicalLayers.getArchiveLayers(slot);
      const archives = generateStateArchives(layers);

      expect(layers.diffSlots).not.toHaveLength(0);

      when(db.hierarchicalStateArchiveRepository.get)
        .calledWith(layers.snapshotSlot)
        .thenResolve(archives.states[layers.snapshotSlot]);

      for (const diffSlot of layers.diffSlots) {
        when(db.hierarchicalStateArchiveRepository.get).calledWith(diffSlot).thenResolve(archives.diffs[diffSlot]);
      }

      await expect(getDiffStateArchive(slot, {db, logger, hierarchicalLayers, codec})).resolves.toEqual({
        stateArchive: archives.finalStateArchive,
        layers,
      });
      // Once for partial state and once for balances
      expect(codec.apply).toHaveBeenCalledTimes(layers.diffSlots.length * 2);
    });

    it("should not apply any diff if empty", async () => {
      const slot = computeStartSlotAtEpoch(70) + 1;
      const layers = hierarchicalLayers.getArchiveLayers(slot);
      const archives = generateStateArchives(layers);

      expect(layers.diffSlots).not.toHaveLength(0);

      when(db.hierarchicalStateArchiveRepository.get)
        .calledWith(layers.snapshotSlot)
        .thenResolve(archives.states[layers.snapshotSlot]);

      for (const diffSlot of layers.diffSlots) {
        when(db.hierarchicalStateArchiveRepository.get).calledWith(diffSlot).thenResolve(null);
      }

      await expect(getDiffStateArchive(slot, {db, logger, hierarchicalLayers, codec})).resolves.toEqual({
        stateArchive: archives.startStateArchive,
        layers,
      });
      expect(codec.apply).not.toBeCalled();
    });
  });
});

function generateSnapshotArchive(slot: number): StateArchive {
  return {
    slot: slot,
    snapshot: true,
    stateRoot: new Uint8Array(),
    balances: Uint8Array.from(Buffer.from(`some balances for snapshot ${slot}`)),
    partialState: Uint8Array.from(Buffer.from(`some snapshot state for snapshot ${slot}`)),
  };
}

function generateDiffArchive(slot: number): StateArchive {
  return {
    slot: slot,
    snapshot: false,
    stateRoot: new Uint8Array(),
    balances: Uint8Array.from(Buffer.from(`some balances for diff ${slot}`)),
    partialState: Uint8Array.from(Buffer.from(`some snapshot state for diff ${slot}`)),
  };
}

function generateStateArchives(layers: Layers): {
  diffs: Record<number, StateArchive>;
  states: Record<number, StateArchive>;
  startStateArchive: StateArchive;
  finalStateArchive: StateArchive;
} {
  const snapshot = generateSnapshotArchive(layers.snapshotSlot);
  const diffStates = layers.diffSlots.map((slot) => generateDiffArchive(slot));
  const diffs: Record<number, StateArchive> = {};
  const states: Record<number, StateArchive> = {[layers.snapshotSlot]: snapshot};

  let activeArchive = snapshot;
  for (const diff of diffStates) {
    diffs[diff.slot] = {
      ...diff,
      partialState: codec.compute(activeArchive.partialState, diff.partialState),
      balances: codec.compute(activeArchive.balances, diff.balances),
    };

    states[diff.slot] = diff;
    activeArchive = diff;
  }

  return {
    diffs,
    states,
    startStateArchive: snapshot,
    finalStateArchive: {
      ...states[Math.max(...layers.diffSlots)],
      snapshot: true,
    },
  };
}
