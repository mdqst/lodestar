import {CliCommand} from "@lodestar/utils";
import {GlobalArgs} from "../options/index.js";
import {beacon} from "./beacon/index.js";
import {bootnode} from "./bootnode/index.js";
import {dev} from "./dev/index.js";
import {lightclient} from "./lightclient/index.js";
import {validator} from "./validator/index.js";

export const cmds: Required<CliCommand<GlobalArgs, Record<never, never>>>["subcommands"] = [
  beacon,
  validator,
  lightclient,
  dev,
  bootnode,
];
