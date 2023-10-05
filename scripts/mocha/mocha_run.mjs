/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import Mocha from "mocha";
import runCommand from "mocha/lib/cli/run.js";
import collectFiles from "mocha/lib/cli/collect-files.js";
import {dump} from "wtfnode";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Consider it a leak if process does not exit within this time
const LEAK_TIMEOUT_MS = 10_000;

// Code is typically the number of failures
async function exitScenarioHandler(failCount) {
  const now = Date.now();
  const timeout = now + LEAK_TIMEOUT_MS;
  console.info(`Leak detection after mocha finishes. failures=${failCount} now='${new Date(now).toLocaleString()}'`);
  const timer = setInterval(detectLeak, 1000);

  async function detectLeak() {
    const now = Date.now();

    if (now > timeout) {
      clearInterval(timer);

      console.error("Process did not terminate, dumping remaining handles and exiting");
      dump();

      process.removeAllListeners("exit");

      // This is not working, process still does not exit
      // process.exit(failCount > 0 ? 0 : 1);

      // This is not working, process still does not exit
      // If process still does not exit, we try to kill with signals
      // for (const signal of ["SIGTERM", "SIGQUIT", "SIGKILL"]) {
      //   process.kill(signal);
      // }

      process.abort();
    } else {
      const resources = process.getActiveResourcesInfo();
      const uniqueResources = new Set(resources);
      console.info(
        `Detecting resource leaks. now='${new Date(now).toLocaleString()}' timeout='${new Date(
          timeout
        ).toLocaleString()}' activeResources: ${resources}`
      );

      // There must be at least TTY used by mocha
      if (uniqueResources.size <= 1) {
        console.info("Seems there is no leak. Clearing leak detection hooks.");
        clearInterval(timer);
        // Dumping resources for debugging purposes
        dump();
      }
    }
  }
}

async function wrappedRunHandler(argv) {
  const mocha = new Mocha(argv);

  const {extension = [], ignore = [], file = [], recursive = false, sort = false, spec = []} = argv;

  const fileCollectParams = {
    ignore,
    extension,
    file,
    recursive,
    sort,
    spec,
  };

  const files = collectFiles(fileCollectParams);
  console.info("single run with %d file(s)", files.length);
  mocha.files = files;

  await mocha.loadFilesAsync();
  mocha.run(exitScenarioHandler);
}

export default {
  ...runCommand,
  handler: wrappedRunHandler,
};
