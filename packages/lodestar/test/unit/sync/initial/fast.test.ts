import sinon, {SinonStub, SinonStubbedInstance} from "sinon";
import {FastSync} from "../../../../src/sync/initial/fast";
import {config} from "@chainsafe/lodestar-config/lib/presets/minimal";
import {ArrayDagLMDGHOST, BeaconChain, ChainEventEmitter, IBeaconChain, ILMDGHOST} from "../../../../src/chain";
import {WinstonLogger} from "@chainsafe/lodestar-utils/lib/logger";
import {INetwork, Libp2pNetwork} from "../../../../src/network";
import {ReputationStore} from "../../../../src/sync/IReputation";
import * as syncUtils from "../../../../src/sync/utils";
import {Checkpoint} from "@chainsafe/lodestar-types";
import {expect} from "chai";
import {SyncStats} from "../../../../src/sync/stats";
import {StubbedBeaconDb} from "../../../utils/stub";
import {generateEmptySignedBlock} from "../../../utils/block";

describe("fast sync", function () {
  const sandbox = sinon.createSandbox();

  let chainStub: SinonStubbedInstance<IBeaconChain>;
  let forkChoiceStub: SinonStubbedInstance<ILMDGHOST>;
  let networkStub: SinonStubbedInstance<INetwork>;
  let repsStub: SinonStubbedInstance<ReputationStore>;
  let getTargetStub: SinonStub;
  let dbStub: StubbedBeaconDb;

  beforeEach(function () {
    forkChoiceStub = sinon.createStubInstance(ArrayDagLMDGHOST);
    chainStub = sinon.createStubInstance(BeaconChain);
    chainStub.forkChoice = forkChoiceStub;
    chainStub.emitter = new ChainEventEmitter();
    networkStub = sinon.createStubInstance(Libp2pNetwork);
    repsStub = sinon.createStubInstance(ReputationStore);
    getTargetStub = sandbox.stub(syncUtils, "getCommonFinalizedCheckpoint");
    dbStub = new StubbedBeaconDb(sinon);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("no peers with finalized epoch", async function () {
    dbStub.blockArchive.lastValue.resolves(generateEmptySignedBlock());
    const sync = new FastSync(
      {blockPerChunk: 5, maxSlotImport: 10, minPeers: 0},
      {
        config,
        chain: chainStub,
        logger: sinon.createStubInstance(WinstonLogger),
        network: networkStub,
        stats: sinon.createStubInstance(SyncStats),
        reputationStore: repsStub,
        db: dbStub,
      }
    );
    getTargetStub.returns({
      epoch: 0,
    });
    networkStub.getPeers.returns([]);
    await sync.start();
  });

  //TODO: make sync abortable (test hangs on sleeping 6s when waiting for peers)
  it.skip("should sync till target and end", function (done) {
    dbStub.blockArchive.lastValue.resolves(generateEmptySignedBlock());
    const statsStub = sinon.createStubInstance(SyncStats);
    statsStub.start.resolves();
    statsStub.getEstimate.returns(1);
    statsStub.getSyncSpeed.returns(1);
    const sync = new FastSync(
      {blockPerChunk: 5, maxSlotImport: 10, minPeers: 0},
      {
        config,
        chain: chainStub,
        logger: sinon.createStubInstance(WinstonLogger),
        network: networkStub,
        stats: statsStub,
        reputationStore: repsStub,
        db: dbStub,
      }
    );
    const target: Checkpoint = {
      epoch: 2,
      root: Buffer.alloc(32, 1),
    };
    getTargetStub.returns(target);
    networkStub.getPeers.returns([]);
    const endCallbackStub = sinon.stub(chainStub.emitter, "removeListener");
    endCallbackStub.withArgs("checkpoint" as any, sinon.match.any).callsFake(() => {
      expect(getTargetStub.calledTwice).to.be.true;
      endCallbackStub.restore();
      done();
    });
    sync.start();
    chainStub.emitter.emit("checkpoint", {epoch: 1, root: Buffer.alloc(32)} as Checkpoint);
    chainStub.emitter.emit("checkpoint", target);
  });

  //TODO: make sync abortable (test hangs on sleeping 6s when waiting for peers)
  it.skip("should continue syncing if there is new target", function (done) {
    dbStub.blockArchive.lastValue.resolves(generateEmptySignedBlock());
    const statsStub = sinon.createStubInstance(SyncStats);
    statsStub.start.resolves();
    statsStub.getEstimate.returns(1);
    statsStub.getSyncSpeed.returns(1);
    const sync = new FastSync(
      {blockPerChunk: 5, maxSlotImport: 10, minPeers: 0},
      {
        config,
        chain: chainStub,
        logger: sinon.createStubInstance(WinstonLogger),
        network: networkStub,
        stats: statsStub,
        reputationStore: repsStub,
        db: dbStub,
      }
    );
    const target1: Checkpoint = {
      epoch: 2,
      root: Buffer.alloc(32, 1),
    };
    const target2: Checkpoint = {
      epoch: 4,
      root: Buffer.alloc(32, 1),
    };
    getTargetStub.onFirstCall().returns(target1).onSecondCall().returns(target2).onThirdCall().returns(target2);
    networkStub.getPeers.returns([]);
    const endCallbackStub = sinon.stub(chainStub.emitter, "removeListener");
    endCallbackStub.withArgs("checkpoint" as any, sinon.match.any).callsFake(() => {
      expect(getTargetStub.calledThrice).to.be.true;
      endCallbackStub.restore();
      done();
    });
    sync.start();
    chainStub.emitter.emit("checkpoint", target1);
    chainStub.emitter.emit("checkpoint", target2);
  });
});
