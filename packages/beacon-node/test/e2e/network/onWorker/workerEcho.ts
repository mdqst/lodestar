import worker from "node:worker_threads";
import {expose} from "@chainsafe/threads/worker";

const parentPort = worker.parentPort;
if (!parentPort) throw Error("parentPort must be defined");

parentPort.on("message", (data) => {
  if (data instanceof Uint8Array) {
    console.log("@@@ worker received Uin8Array", data);
    parentPort.postMessage(data.length);
    return;
  } else if ((data as {data: Uint8Array}).data != null) {
    console.log("@@@ worker received data: Uin8Array object", data);
    parentPort.postMessage(data.data.length);
    return;
  }

  parentPort.postMessage(data);
});

expose(() => {
  //
});
