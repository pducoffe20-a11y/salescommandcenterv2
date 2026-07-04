import type { DealReview } from "../types/workflow";

export const dealReviews: DealReview[] = [
  {
    account: "North Coast Healthcare Association",
    opportunity: "Member CE modernization",
    route: "Interactive Dashboard",
    judgment:
      "Promising but not yet forecastable: education pain is plausible, economic ownership is unconfirmed.",
    confidence: "Medium",
    momentum: 72,
    risk: 41,
    stakeholderCoverage: 58,
    evidence: 64,
    meddic: [
      {
        name: "Metrics",
        status: "Partial",
        strength: "Medium",
        confirmed: ["Seller notes cite reporting burden."],
        missing: "No quantified CE completion or admin-time metric.",
        next: "Ask what reporting task consumes the most time.",
      },
      {
        name: "Economic buyer",
        status: "Gap",
        strength: "Low",
        confirmed: [],
        missing: "Budget owner not confirmed.",
        next: "Identify whether education, membership, or finance owns budget.",
      },
      {
        name: "Decision criteria",
        status: "Inferred",
        strength: "Medium",
        confirmed: ["Member learning is the stated motion."],
        missing: "No confirmed selection criteria.",
        next: "Ask what would make a platform change worth the effort.",
      },
      {
        name: "Decision process",
        status: "Gap",
        strength: "Low",
        confirmed: [],
        missing: "No process, timeline, or procurement path.",
        next: "Ask who would need to weigh in if the use case is real.",
      },
      {
        name: "Identify pain",
        status: "Partial",
        strength: "Medium",
        confirmed: ["CE/member learning context is provided."],
        missing: "Pain is not validated by buyer words.",
        next: "Use discovery to test reporting and engagement hypotheses.",
      },
      {
        name: "Champion",
        status: "Unproven",
        strength: "Low",
        confirmed: [],
        missing: "No champion behavior yet.",
        next: "Look for a contact willing to define the problem.",
      },
    ],
    signals: [
      "Member learning role exists",
      "Healthcare CE angle could be credible",
      "Customer story match is plausible but not definitive",
    ],
    risks: [
      "No confirmed budget owner",
      "No decision process",
      "Could be content issue rather than platform issue",
    ],
    stakeholders: [
      {
        name: "Theo Grant",
        role: "Director of Member Learning",
        coverage: "Known contact",
        evidence: "Provided prospect input",
      },
      {
        name: "Finance / COO",
        role: "Economic buyer candidate",
        coverage: "Unknown",
        evidence: "Inference only",
      },
    ],
    nextMoves: [
      {
        who: "Theo Grant",
        why: "He is the clearest education stakeholder",
        angle: "Validate CE reporting and member engagement pressure",
        proof: "Use healthcare education story only as a light example",
        outcome: "Confirm whether a working session is useful",
      },
    ],
    gaps: ["Budget owner", "current platform", "CE program scale"],
  },
  {
    account: "Alliance for Applied Manufacturing Credentials",
    opportunity: "Certification program refresh",
    route: "Structured Deal Review",
    judgment:
      "Best near-term new-logo path if certification refresh is real; avoid assuming urgency until timing is verified.",
    confidence: "Medium-high",
    momentum: 79,
    risk: 33,
    stakeholderCoverage: 62,
    evidence: 70,
    meddic: [],
    signals: [
      "Certification persona identified",
      "Workbook category fit is strong",
      "Likely education revenue angle",
    ],
    risks: ["Refresh timing not confirmed", "No current vendor evidence"],
    stakeholders: [
      {
        name: "Maren Ortiz",
        role: "VP, Certification Programs",
        coverage: "Primary",
        evidence: "Provided prospect record",
      },
    ],
    nextMoves: [
      {
        who: "Maren Ortiz",
        why: "Certification ownership is likely relevant",
        angle: "Ask whether delivery/reporting changes are in scope",
        proof: "Credentialing modernization example",
        outcome: "Validate discovery meeting",
      },
    ],
    gaps: ["Current delivery model", "certification volume", "decision team"],
  },
];
