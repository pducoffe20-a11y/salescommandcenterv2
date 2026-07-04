import type { StrategyRecord } from "../types/workflow";

export function calculateStrategyScore(scores: StrategyRecord["scores"]) {
  return Math.round((scores.fit + scores.urgency + scores.persona + scores.evidence) / 4);
}

export function getStrategyScoreDelta(record: StrategyRecord) {
  return Math.abs(calculateStrategyScore(record.scores) - record.score_total);
}

export function hasConsistentStrategyScore(record: StrategyRecord, tolerance = 2) {
  return getStrategyScoreDelta(record) <= tolerance;
}
