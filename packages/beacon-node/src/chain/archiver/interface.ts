import {CheckpointWithHex} from "@lodestar/fork-choice";
import {Metrics} from "../../metrics/metrics.js";
import {RootHex} from "@lodestar/types";

export enum StateArchiveMode {
  Frequency = "frequency",
  Differential = "diff",
}

export interface StatesArchiverOpts {
  /**
   * Minimum number of epochs between archived states
   */
  archiveStateEpochFrequency: number;
  /**
   * Strategy to store archive states
   */
  stateArchiveMode: StateArchiveMode;
}

export type ArchiverOpts = StatesArchiverOpts & {
  disableArchiveOnCheckpoint?: boolean;
  archiveBlobEpochs?: number;
};

export type ProposalStats = {
  total: number;
  finalized: number;
  orphaned: number;
  missed: number;
};

export type FinalizedStats = {
  allValidators: ProposalStats;
  attachedValidators: ProposalStats;
  finalizedCanonicalCheckpointsCount: number;
  finalizedFoundCheckpointsInStateCache: number;
  finalizedAttachedValidatorsCount: number;
};

export interface StateArchiveStrategy {
  onCheckpoint(checkpoint: CheckpointWithHex, finalized: boolean, metrics?: Metrics | null): Promise<void>;
  maybeArchiveState(finalized: CheckpointWithHex, metrics?: Metrics | null): Promise<void>;
}
