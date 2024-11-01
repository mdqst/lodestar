import {CheckpointWithHex} from "@lodestar/fork-choice";
import {RootHex} from "@lodestar/types";
import {Metrics} from "../../../metrics/metrics.js";
import {StateArchiveStrategy} from "../interface.js";
import {IStateRegenerator} from "../../regen/interface.js";
import {Logger} from "@lodestar/logger";
import {IHistoricalStateRegen} from "../../historicalState/types.js";
import {CachedBeaconStateAllForks, computeStartSlotAtEpoch} from "@lodestar/state-transition";

export class DifferentialStateArchiveStrategy implements StateArchiveStrategy {
  constructor(
    protected modules: {
      historicalStateRegen: IHistoricalStateRegen | undefined;
      regen: IStateRegenerator;
      logger: Logger;
    }
  ) {}

  onCheckpoint(_stateRoot: RootHex, _metrics?: Metrics | null): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async onFinalizedCheckpoint(finalized: CheckpointWithHex, _metrics?: Metrics | null): Promise<void> {
    await this.maybeArchiveState(finalized);
  }

  async maybeArchiveState(finalized: CheckpointWithHex): Promise<void> {
    // starting from Mar 2024, the finalized state could be from disk or in memory
    const state = await this.modules.regen.getCheckpointStateOrBytes(finalized);
    if (state === null) {
      this.modules.logger.warn("Checkpoint state not available to archive.", {
        epoch: finalized.epoch,
        root: finalized.rootHex,
      });
      return;
    }

    if (Array.isArray(state) && state.constructor === Uint8Array) {
      return this.modules.historicalStateRegen?.storeHistoricalState(computeStartSlotAtEpoch(finalized.epoch), state);
    }

    return this.modules.historicalStateRegen?.storeHistoricalState(
      (state as CachedBeaconStateAllForks).slot,
      (state as CachedBeaconStateAllForks).serialize()
    );
  }
}
