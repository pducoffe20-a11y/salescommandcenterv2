import { describe, expect, it } from "vitest";
import { dealReviews } from "../data/dealReviews";
import { getMeddicEvidenceGaps, getMissingMeddicCategories } from "./meddic";

describe("MEDDIC parsing", () => {
  it("detects a complete MEDDIC review when all categories are present", () => {
    expect(getMissingMeddicCategories(dealReviews[0])).toEqual([]);
  });

  it("detects a missing MEDDIC review when a seeded deal has no category cards", () => {
    expect(getMissingMeddicCategories(dealReviews[1])).toEqual([
      "Metrics",
      "Economic buyer",
      "Decision criteria",
      "Decision process",
      "Identify pain",
      "Champion",
    ]);
  });

  it("flags MEDDIC categories with gap status or no confirmed evidence", () => {
    expect(getMeddicEvidenceGaps(dealReviews[0])).toEqual(["Economic buyer", "Decision process", "Champion"]);
  });
});
