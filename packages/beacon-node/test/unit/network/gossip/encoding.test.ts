import {describe, it, expect} from "vitest";
import {getTopicValidatorResult, getTopicValidatorResultIndex} from "../../../../src/network/gossip/encoding";
import {TopicValidatorResult} from "@libp2p/interface";

describe("TopicValidatorResult index to enum", () => {
  it("getTopicValidatorResult", () => {
    expect(getTopicValidatorResult(0)).toEqual(TopicValidatorResult.Accept);
    expect(getTopicValidatorResult(1)).toEqual(TopicValidatorResult.Ignore);
    expect(getTopicValidatorResult(2)).toEqual(TopicValidatorResult.Reject);
  });

  it("getTopicValidatorResultIndex", () => {
    expect(getTopicValidatorResultIndex(TopicValidatorResult.Accept)).toEqual(0);
    expect(getTopicValidatorResultIndex(TopicValidatorResult.Ignore)).toEqual(1);
    expect(getTopicValidatorResultIndex(TopicValidatorResult.Reject)).toEqual(2);
  });
});
