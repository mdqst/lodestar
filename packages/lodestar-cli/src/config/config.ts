import {Json} from "@chainsafe/ssz";
import defaults, {IBeaconNodeOptions} from "@chainsafe/lodestar/lib/node/options";

import {readFile, writeFile} from "../lodestar/util";
import {BeaconNodeOptions} from "../lodestar/node/options";
import {generateTomlConfig} from "../lodestar/util/toml";
import {validateConfig} from "../lodestar/util/config";

export function createBeaconConfig(): IBeaconNodeOptions {
  return {...defaults};
}

export async function writeBeaconConfig(filename: string, config: IBeaconNodeOptions): Promise<void> {
  await writeFile(filename, generateTomlConfig(config, BeaconNodeOptions) as Json);
}

export async function readBeaconConfig(filename: string): Promise<IBeaconNodeOptions> {
  return validateConfig<IBeaconNodeOptions>(await readFile(filename), BeaconNodeOptions) as IBeaconNodeOptions;
}

export async function initBeaconConfig(filename: string): Promise<void> {
  await writeBeaconConfig(filename, createBeaconConfig());
}
