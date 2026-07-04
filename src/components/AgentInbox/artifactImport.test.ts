import { describe, expect, it } from "vitest";
import { createPdfArtifactImportRows, parseArtifactImport } from "./artifactImport";

describe("artifact import normalization", () => {
  it("normalizes pre-call brief bundles into one artifact per brief", () => {
    const rows = parseArtifactImport(
      JSON.stringify({
        metadata: {
          created_at_local: "2026-07-03T20:30:00-05:00",
          timezone: "America/Chicago",
        },
        briefs: [
          {
            brief_id: "trumerit-2026-07-06-intro",
            brief_status: "ready",
            meeting: {
              subject: "TruMerit x D2L; Intro Session",
              start_local: "2026-07-06T09:00:00-05:00",
              external_attendees: [{ name: "Hajo Oltmanns", email: "holtmanns@trumerit.org" }],
            },
            account: {
              name: "TruMerit",
              vertical: "Healthcare credentialing and professional certification",
            },
            account_snapshot: {
              icp_fit: { rating: "Strong" },
              account_read: "TruMerit appears to be exploring a partner-supported solution.",
              seller_note: "Validate whether the new solution is expected to generate revenue.",
              timing_signals: [{ signal: "Evaluating potential partners", why_it_matters: "Active window." }],
            },
            contact_angle: {
              approach_note: "Lead with curiosity around the new solution.",
            },
            d2l_value_angles: [{ angle_name: "Credentialing-ready learning experience" }],
            discovery_questions: [{ question: "What is the core problem?" }],
            likely_objections: [{ objection: "Not ready for platform change" }],
            opener_next_step_ask: "Ask for a 25-minute working session.",
          },
        ],
      }),
      "PreCall Briefs.json",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].validationStatus).toBe("Valid");
    expect(rows[0].kind).toBe("Pre-call brief");
    expect(rows[0].title).toContain("TruMerit");
    expect(rows[0].artifact?.payload).toMatchObject({
      accounts: [
        expect.objectContaining({
          accountId: "trumerit",
          accountName: "TruMerit",
        }),
      ],
      meetings: [
        expect.objectContaining({
          title: "TruMerit x D2L; Intro Session",
        }),
      ],
    });
  });

  it("normalizes deal pipeline analysis into a promotable portfolio artifact", () => {
    const rows = parseArtifactImport(
      JSON.stringify({
        analysis_type: "deal_pipeline_json_analysis",
        as_of: { user_local_datetime: "2026-07-03T20:40:00-05:00" },
        source: { file: "user_files/01-deals_20260704.csv", records_analyzed: 1 },
        headline_judgment: "The pipeline is top-heavy and hygiene-limited.",
        portfolio_summary: { opportunity_count: 1, total_bookings_usd: 39246.6 },
        recommended_next_moves: [
          {
            priority: 1,
            action: "Run a close-plan check.",
            why: "It is the only Best Case deal.",
            target_opportunities: ["Justice & Upward Mobility Project - LMS (Pilot Year)"],
          },
        ],
        opportunities: [
          {
            opportunity_name: "Justice & Upward Mobility Project - LMS (Pilot Year)",
            account: "Justice & Upward Mobility Project",
            bookings_usd: 39246.6,
            forecast_category: "Best Case",
            stage: "4 - Decision Point",
            engagement_risk_score: 20,
            momentum: "strong_near_term",
            next_event_utc: "2026-07-06T16:00:00+00:00",
            signals: ["forecast_best_case", "has_next_event"],
            recommended_action: "Confirm decision outcome.",
          },
        ],
        open_questions: ["Which opportunities have confirmed economic-buyer involvement?"],
        confidence: { overall: "medium_low" },
      }),
      "deal_pipeline_analysis_20260704.json",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].validationStatus).toBe("Valid");
    expect(rows[0].artifact?.title).toContain("Deal pipeline analysis");
    expect(rows[0].artifact?.payload).toMatchObject({
      accounts: [
        expect.objectContaining({
          accountName: "Justice & Upward Mobility Project",
          stage: "4 - Decision Point",
        }),
      ],
    });
  });

  it("normalizes CSV rows into research-note artifacts", () => {
    const rows = parseArtifactImport(
      [
        "account,opportunity_name,stage,recommended_action",
        "Brightpath Learning Council,Brightpath LMS,2 - Intention to Move,Book next discovery",
      ].join("\n"),
      "pipeline.csv",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].validationStatus).toBe("Valid");
    expect(rows[0].artifact?.title).toBe("Brightpath LMS");
    expect(rows[0].artifact?.payload).toMatchObject({
      accounts: [
        expect.objectContaining({
          accountName: "Brightpath Learning Council",
          recommendedAction: "Book next discovery",
        }),
      ],
    });
  });

  it("normalizes PDFs as best-effort review artifacts", () => {
    const bytes = new TextEncoder().encode("%PDF-1.4\n(TruMerit CE renewal brief) Tj\n%%EOF");
    const rows = createPdfArtifactImportRows("trumerit-brief.pdf", bytes.buffer as ArrayBuffer);

    expect(rows).toHaveLength(1);
    expect(rows[0].validationStatus).toBe("Valid");
    expect(rows[0].artifact?.title).toBe("PDF review: trumerit-brief.pdf");
    expect(rows[0].artifact?.body).toContain("TruMerit CE renewal brief");
  });
});
