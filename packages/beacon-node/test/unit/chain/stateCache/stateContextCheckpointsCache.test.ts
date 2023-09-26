import {expect} from "chai";
import {SLOTS_PER_EPOCH} from "@lodestar/params";
import {CachedBeaconStateAllForks} from "@lodestar/state-transition";
import {Epoch} from "@lodestar/types";
import {
  CheckpointHex,
  CheckpointStateCache,
  PersistentApis,
  StateFile,
  findClosestCheckpointState,
  toCheckpointHex,
  toCheckpointKey,
  toTmpFilePath,
} from "../../../../src/chain/stateCache/stateContextCheckpointsCache.js";
import {generateCachedState} from "../../../utils/state.js";
import {ShufflingCache} from "../../../../src/chain/shufflingCache.js";

describe("CheckpointStateCache", function () {
  let cache: CheckpointStateCache;
  let fileApisBuffer: Map<string, Uint8Array>;
  const cp0 = {epoch: 20, root: Buffer.alloc(32)};
  const cp1 = {epoch: 21, root: Buffer.alloc(32, 1)};
  const cp2 = {epoch: 22, root: Buffer.alloc(32, 2)};
  const [cp0Hex, cp1Hex, cp2Hex] = [cp0, cp1, cp2].map((cp) => toCheckpointHex(cp));
  const [cp0Key, cp1Key, cp2Key] = [cp0Hex, cp1Hex, cp2Hex].map((cp) => toCheckpointKey(cp));
  const states = [cp0, cp1, cp2].map((cp) => generateCachedState({slot: cp.epoch * SLOTS_PER_EPOCH}));
  const stateBytes = states.map((state) => state.serialize());

  beforeEach(() => {
    fileApisBuffer = new Map();
    const persistentApis: PersistentApis = {
      writeIfNotExist: (filePath, bytes) => {
        if (!fileApisBuffer.has(filePath)) {
          fileApisBuffer.set(filePath, bytes);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      },
      removeFile: (filePath) => {
        if (fileApisBuffer.has(filePath)) {
          fileApisBuffer.delete(filePath);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      },
      readFile: (filePath) => Promise.resolve(fileApisBuffer.get(filePath) || Buffer.alloc(0)),
      ensureDir: () => Promise.resolve(),
    };
    cache = new CheckpointStateCache({maxStatesInMemory: 2, persistentApis, shufflingCache: new ShufflingCache()});
    cache.add(cp0, states[0]);
    cache.add(cp1, states[1]);
  });

  const pruneTestCases: {
    name: string;
    cpHexGet: CheckpointHex;
    cpKeyPersisted: string;
    stateBytesPersisted: Uint8Array;
  }[] = [
    {
      name: "should prune cp0 from memory and persist to disk",
      cpHexGet: cp1Hex,
      cpKeyPersisted: toTmpFilePath(cp0Key),
      stateBytesPersisted: stateBytes[0],
    },
    {
      name: "should prune cp1 from memory and persist to disk",
      cpHexGet: cp0Hex,
      cpKeyPersisted: toTmpFilePath(cp1Key),
      stateBytesPersisted: stateBytes[1],
    },
  ];

  for (const {name, cpHexGet, cpKeyPersisted, stateBytesPersisted} of pruneTestCases) {
    it(name, function () {
      expect(fileApisBuffer.size).to.be.equal(0);
      // use cpHexGet to move it to head,
      cache.get(cpHexGet);
      cache.add(cp2, states[2]);
      expect(cache.get(cp2Hex)?.hashTreeRoot()).to.be.deep.equal(states[2].hashTreeRoot());
      expect(fileApisBuffer.size).to.be.equal(1);
      expect(Array.from(fileApisBuffer.keys())).to.be.deep.equal([cpKeyPersisted]);
      expect(fileApisBuffer.get(cpKeyPersisted)).to.be.deep.equal(stateBytesPersisted);
    });
  }

  const reloadTestCases: {
    name: string;
    cpHexGet: CheckpointHex;
    cpKeyPersisted: CheckpointHex;
    stateBytesPersisted: Uint8Array;
    cpKeyPersisted2: CheckpointHex;
    stateBytesPersisted2: Uint8Array;
  }[] = [
    {
      name: "reload cp0 from disk",
      cpHexGet: cp1Hex,
      cpKeyPersisted: cp0Hex,
      stateBytesPersisted: stateBytes[0],
      cpKeyPersisted2: cp1Hex,
      stateBytesPersisted2: stateBytes[1],
    },
    {
      name: "reload cp1 from disk",
      cpHexGet: cp0Hex,
      cpKeyPersisted: cp1Hex,
      stateBytesPersisted: stateBytes[1],
      cpKeyPersisted2: cp0Hex,
      stateBytesPersisted2: stateBytes[0],
    },
  ];

  for (const {
    name,
    cpHexGet,
    cpKeyPersisted,
    stateBytesPersisted,
    cpKeyPersisted2,
    stateBytesPersisted2,
  } of reloadTestCases) {
    it(name, async function () {
      expect(fileApisBuffer.size).to.be.equal(0);
      // use cpHexGet to move it to head,
      cache.get(cpHexGet);
      cache.add(cp2, states[2]);
      expect(cache.get(cp2Hex)?.hashTreeRoot()).to.be.deep.equal(states[2].hashTreeRoot());
      expect(fileApisBuffer.size).to.be.equal(1);
      const persistedKey0 = toTmpFilePath(toCheckpointKey(cpKeyPersisted));
      expect(Array.from(fileApisBuffer.keys())).to.be.deep.equal([persistedKey0]);
      expect(fileApisBuffer.get(persistedKey0)).to.be.deep.equal(stateBytesPersisted);
      expect(await cache.getStateOrBytes(cpKeyPersisted)).to.be.deep.equal(stateBytesPersisted);
      // simple get() does not reload from disk
      expect(cache.get(cpKeyPersisted)).to.be.null;
      // reload cpKeyPersisted from disk
      expect((await cache.getOrReload(cpKeyPersisted))?.serialize()).to.be.deep.equal(stateBytesPersisted);
      // check the 2nd persisted checkpoint
      const persistedKey2 = toTmpFilePath(toCheckpointKey(cpKeyPersisted2));
      expect(Array.from(fileApisBuffer.keys())).to.be.deep.equal([persistedKey2]);
      expect(fileApisBuffer.get(persistedKey2)).to.be.deep.equal(stateBytesPersisted2);
      expect(await cache.getStateOrBytes(cpKeyPersisted2)).to.be.deep.equal(stateBytesPersisted2);
    });
  }

  it("pruneFinalized", function () {
    cache.add(cp1, states[1]);
    cache.add(cp2, states[2]);
    // cp0 is persisted
    expect(fileApisBuffer.size).to.be.equal(1);
    expect(Array.from(fileApisBuffer.keys())).to.be.deep.equal([toTmpFilePath(cp0Key)]);
    // cp1 is in memory
    expect(cache.get(cp1Hex)).to.be.not.null;
    // cp2 is in memory
    expect(cache.get(cp2Hex)).to.be.not.null;
    // finalize epoch cp2
    cache.pruneFinalized(cp2.epoch);
    expect(fileApisBuffer.size).to.be.equal(0);
    expect(cache.get(cp1Hex)).to.be.null;
    expect(cache.get(cp2Hex)).to.be.not.null;
  });

  describe("findClosestCheckpointState", function () {
    const cacheMap = new Map<string, CachedBeaconStateAllForks | StateFile>();
    cacheMap.set(cp0Key, states[0]);
    cacheMap.set(cp1Key, states[1]);
    cacheMap.set(cp2Key, states[2]);
    const testCases: {name: string; epoch: Epoch; expectedState: CachedBeaconStateAllForks}[] = [
      {
        name: "should return cp0 for epoch less than cp0",
        epoch: 19,
        expectedState: states[0],
      },
      {
        name: "should return cp0 for epoch same to cp0",
        epoch: 20,
        expectedState: states[0],
      },
      {
        name: "should return cp1 for epoch same to cp1",
        epoch: 21,
        expectedState: states[1],
      },
      {
        name: "should return cp2 for epoch same to cp2",
        epoch: 22,
        expectedState: states[2],
      },
      {
        name: "should return cp2 for epoch greater than cp2",
        epoch: 23,
        expectedState: states[2],
      },
    ];

    for (const {name, epoch, expectedState} of testCases) {
      it(name, function () {
        const cpHex = toCheckpointHex({epoch, root: Buffer.alloc(32)});
        const state = findClosestCheckpointState(cpHex, cacheMap);
        expect(state.hashTreeRoot()).to.be.deep.equal(expectedState.hashTreeRoot());
      });
    }
  });
});