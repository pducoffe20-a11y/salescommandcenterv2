import type { DealReview } from "../types/workflow";

export const requiredMeddicCategories = [
  "Metrics",
  "Economic buyer",
  "Decision criteria",
  "Decision process",
  "Identify pain",
  "Champion",
] as const;

export function getMissingMeddicCategories(deal: DealReview) {
  const present = new Set(deal.meddic.map((item) => item.name));
  return requiredMeddicCategories.filter((category) => !present.has(category));
}

export function getMeddicEvidenceGaps(deal: DealReview) {
  return deal.meddic.filter((item) => item.status === "Gap" || item.confirmed.length === 0).map((item) => item.name);
}
