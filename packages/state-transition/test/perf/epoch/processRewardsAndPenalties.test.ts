import {itBench} from "@dapplion/benchmark";
import {processRewardsAndPenalties} from "../../../src/epoch/processRewardsAndPenalties.js";
import {StateAltairEpoch} from "../types.js";
import {generatePerfTestCachedStateAltair, numValidators} from "../util.js";
import {mutateInactivityScores} from "./util.js";
import {FlagFactors, generateBalanceDeltasEpochTransitionCache} from "./utilPhase0.js";

// PERF: Cost = 'proportional' to $VALIDATOR_COUNT. Extra work is done per validator the more status flags are set

// Worst case:
// statuses: everything true
// inactivityScore > 0

describe("altair processRewardsAndPenalties", () => {
  const vc = numValidators;
  const testCases: {id: string; isInInactivityLeak: boolean; flagFactors: FlagFactors; factorWithPositive: number}[] = [
    {
      id: "normalcase",
      isInInactivityLeak: false,
      flagFactors: {
        prevSourceAttester: 0.98,
        prevTargetAttester: 0.96,
        prevHeadAttester: 0.93,
        currSourceAttester: 0.95,
        currTargetAttester: 0.93,
        currHeadAttester: 0.91,
        unslashed: 1,
        eligibleAttester: 0.98,
      },
      factorWithPositive: 0.04,
    },
    {
      id: "worstcase",
      isInInactivityLeak: true,
      flagFactors: 0xff,
      factorWithPositive: 1,
    },
  ];

  for (const {id, isInInactivityLeak, flagFactors, factorWithPositive} of testCases) {
    itBench<StateAltairEpoch, StateAltairEpoch>({
      id: `altair processRewardsAndPenalties - ${vc} ${id}`,
      yieldEventLoopAfterEach: true, // So SubTree(s)'s WeakRef can be garbage collected https://github.com/nodejs/node/issues/39902
      before: () => {
        const state = generatePerfTestCachedStateAltair({goBackOneSlot: true});
        const cache = generateBalanceDeltasEpochTransitionCache(state, isInInactivityLeak, flagFactors);
        mutateInactivityScores(state, factorWithPositive);
        return {state, cache};
      },
      beforeEach: ({state, cache}) => ({state: state.clone(), cache}),
      fn: ({state, cache}) => processRewardsAndPenalties(state, cache),
    });
  }
});
