import {ChainForkConfig} from "@lodestar/config";
import {Db, Repository} from "@lodestar/db";
import {phase0, ssz} from "@lodestar/types";
import {bytesToInt} from "@lodestar/utils";
import {Bucket, getBucketNameByValue} from "../buckets.js";

export class Eth1DataRepository extends Repository<number, phase0.Eth1DataOrdered> {
  constructor(config: ChainForkConfig, db: Db) {
    const bucket = Bucket.phase0_eth1Data;
    super(config, db, bucket, ssz.phase0.Eth1DataOrdered, getBucketNameByValue(bucket));
  }

  decodeKey(data: Buffer): number {
    return bytesToInt(super.decodeKey(data) as unknown as Uint8Array, "be");
  }

  getId(_value: phase0.Eth1Data): number {
    throw new Error("Unable to create timestamp from block hash");
  }

  async batchPutValues(eth1Datas: (phase0.Eth1DataOrdered & {timestamp: number})[]): Promise<void> {
    await this.batchPut(
      eth1Datas.map((eth1Data) => ({
        key: eth1Data.timestamp,
        value: eth1Data,
      }))
    );
  }

  async deleteOld(timestamp: number): Promise<void> {
    await this.batchDelete(await this.keys({lt: timestamp}));
  }
}
