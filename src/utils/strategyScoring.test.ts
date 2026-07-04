import { describe, expect, it } from "vitest";
import { strategyRecords } from "../data/strategyRecords";
import { calculateStrategyScore, getStrategyScoreDelta, hasConsistentStrategyScore } from "./strategyScoring";

describe("strategy scoring", () => {
  it("calculates the rounded average from fit, urgency, persona, and evidence", () => {
    expect(calculateStrategyScore({ fit: 90, urgency: 80, persona: 70, evidence: 60 })).toBe(75);
  });

  it("keeps seeded StrategyRecord totals within an explicit rounding tolerance", () => {
    expect(strategyRecords.map(getStrategyScoreDelta)).toEqual([2, 0, 1]);
    expect(strategyRecords.every((record) => hasConsistentStrategyScore(record))).toBe(true);
  });
});
