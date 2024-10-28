import workerThreads, {TransferListItem} from "node:worker_threads";
import {spawn, Worker} from "@chainsafe/threads";

export type EchoWorker = {
  send<T>(data: T): Promise<T>;
  send2<T extends {data: Uint8Array}>(data: T, transferList?: readonly TransferListItem[]): Promise<number>;
  sendUint8Array(data: Uint8Array, transferList?: readonly TransferListItem[]): Promise<number>;
  close(): Promise<void>;
};

export async function getEchoWorker(): Promise<EchoWorker> {
  const workerThreadjs = new Worker("./workerEcho.js");
  const worker = workerThreadjs as unknown as workerThreads.Worker;

  await spawn<any>(workerThreadjs, {
    // A Lodestar Node may do very expensive task at start blocking the event loop and causing
    // the initialization to timeout. The number below is big enough to almost disable the timeout
    timeout: 5 * 60 * 1000,
    // TODO: types are broken on spawn, which claims that `NetworkWorkerApi` does not satifies its contrains
  });

  return {
    send<T>(data: T): Promise<T> {
      return new Promise((resolve, reject) => {
        worker.once("message", (data) => resolve(data));
        worker.once("messageerror", reject);
        worker.once("error", reject);
        worker.postMessage(data);
      });
    },

    send2<T>(data: T, transferList?: readonly TransferListItem[]): Promise<number> {
      return new Promise((resolve, reject) => {
        worker.once("message", (data) => resolve(data));
        worker.once("messageerror", reject);
        worker.once("error", reject);
        worker.postMessage(data, transferList);
      });
    },

    sendUint8Array(data: Uint8Array, transferList?: readonly TransferListItem[]): Promise<number> {
      return new Promise((resolve, reject) => {
        worker.once("message", (data: number) => resolve(data));
        worker.once("messageerror", reject);
        worker.once("error", reject);
        worker.postMessage(data, transferList);
      });
    },

    async close() {
      await workerThreadjs.terminate();
    },
  };
}
