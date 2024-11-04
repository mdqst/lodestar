import {Slot} from "@lodestar/types";
import {IBeaconDb} from "../../../db/index.js";
import {StateArchive} from "../../../db/repositories/hierarchicalStateArchive.js";

export async function getSnapshotStateArchive(slot: Slot, db: IBeaconDb): Promise<StateArchive | null> {
  const stateArchive = await db.hierarchicalStateArchiveRepository.get(slot);
  if (stateArchive?.snapshot) return stateArchive;

  return null;
}

export async function searchSnapshotStateArchive(from: Slot, to: Slot, db: IBeaconDb): Promise<StateArchive | null> {
  for await (const stateArchive of db.hierarchicalStateArchiveRepository.valuesStream({
    lte: Math.max(from, to),
    gte: Math.min(from, to),
    reverse: true,
  })) {
    if (stateArchive.snapshot) return stateArchive;
  }

  return null;
}
