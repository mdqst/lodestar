import {SLOTS_PER_EPOCH} from "@lodestar/params";
import {CommitteeIndex, Epoch, Slot, ValidatorIndex} from "@lodestar/types";

// Copied from lodestar-api package to avoid depending on the package
export interface AttesterDuty {
  validatorIndex: ValidatorIndex;
  committeeIndex: CommitteeIndex;
  committeeLength: number;
  committeesAtSlot: number;
  validatorCommitteeIndex: number;
  slot: Slot;
}

export function getCommitteeAssignments(
  epoch: Epoch,
  requestedValidatorIndices: ValidatorIndex[],
  epochCommittees: Uint32Array[][]
): Map<ValidatorIndex, AttesterDuty> {
  const requestedValidatorIndicesSet = new Set(requestedValidatorIndices);
  const duties = new Map<ValidatorIndex, AttesterDuty>();

  for (let epochSlot = 0; epochSlot < SLOTS_PER_EPOCH; epochSlot++) {
    const slotCommittees = epochCommittees[epochSlot];
    for (let i = 0, committeesAtSlot = slotCommittees.length; i < committeesAtSlot; i++) {
      for (let j = 0, committeeLength = slotCommittees[i].length; j < committeeLength; j++) {
        const validatorIndex = slotCommittees[i][j];
        if (requestedValidatorIndicesSet.has(validatorIndex)) {
          duties.set(validatorIndex, {
            validatorIndex,
            committeeLength,
            committeesAtSlot,
            validatorCommitteeIndex: j,
            committeeIndex: i,
            slot: epoch * SLOTS_PER_EPOCH + epochSlot,
          });
        }
      }
    }
  }

  return duties;
}
