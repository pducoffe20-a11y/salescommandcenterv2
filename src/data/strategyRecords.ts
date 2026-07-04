import type { StrategyRecord } from "../workflowData";

export const strategyRecords: StrategyRecord[] = [
  {
    prospect_id: "p1",
    full_name: "Maren Ortiz",
    title: "VP, Certification Programs",
    organization: "Alliance for Applied Manufacturing Credentials",
    email: "maren.ortiz@example.com",
    category: "Credentialing / certification / CE",
    status: "Work Now",
    score_total: 88,
    scores: { fit: 92, urgency: 84, persona: 90, evidence: 78 },
    tenure_months: 14,
    verified_facts: [
      "Provided title owns certification programs.",
      "Organization appears in credentialing target list.",
    ],
    inferred_pains: [
      "Certification delivery and reporting may need clearer governance.",
    ],
    unknowns: ["Current delivery platform", "Certification refresh timing"],
    what_to_check_first:
      "Confirm whether certification delivery is being refreshed this year.",
    evidence_notes:
      "Strong persona and category fit; timing still needs validation.",
    matched_customer_story: "Credentialing association modernization story",
    recommended_actions: [
      "Send short validation email",
      "Find certification catalog page",
      "Create 3-day follow-up task",
    ],
    outreach_payload: {
      review_status: "needs_review",
      subject_line: "Question on certification delivery",
      email_body:
        "Maren — saw your role connects closely to certification programs. If your team is looking at delivery or reporting changes this year, it may be worth comparing notes on what other credentialing groups simplify first. Open to a short conversation next week?",
      review_flags: ["Validate timing before sending"],
      fact_check_targets: ["Certification refresh", "Current LMS"],
      suppression_reason: "",
    },
  },
  {
    prospect_id: "p2",
    full_name: "Theo Grant",
    title: "Director of Member Learning",
    organization: "North Coast Healthcare Association",
    email: "theo.grant@example.com",
    category: "Association / member organization",
    status: "Work Now",
    score_total: 82,
    scores: { fit: 86, urgency: 78, persona: 86, evidence: 76 },
    tenure_months: 31,
    verified_facts: [
      "Provided role mentions member learning.",
      "Healthcare association appears in account list.",
    ],
    inferred_pains: [
      "CE reporting and member engagement may be active concerns.",
    ],
    unknowns: ["CE accreditation requirements", "Member portal ownership"],
    what_to_check_first: "Check whether CE/CME programs are listed publicly.",
    evidence_notes:
      "Useful target with plausible CE angle; no live research in v1.",
    matched_customer_story: "Healthcare education program story",
    recommended_actions: [
      "Validate CE scope",
      "Draft low-pressure note",
      "Save as work-now prospect",
    ],
    outreach_payload: {
      review_status: "needs_review",
      subject_line: "Member education question",
      email_body:
        "Theo — I noticed your work is tied to member learning. If CE reporting or learner engagement is becoming more important this year, I’d be glad to compare notes on how similar teams keep the experience simple. Would a quick fit check be useful?",
      review_flags: ["Do not imply known CE initiative"],
      fact_check_targets: ["CE program page"],
      suppression_reason: "",
    },
  },
  {
    prospect_id: "p3",
    full_name: "Priya Shah",
    title: "Operations Manager",
    organization: "LocalPrint Services",
    email: "priya.shah@example.com",
    category: "Poor fit / suppress",
    status: "Suppress",
    score_total: 24,
    scores: { fit: 18, urgency: 22, persona: 28, evidence: 30 },
    tenure_months: null,
    verified_facts: ["Provided account name and operations title only."],
    inferred_pains: [],
    unknowns: ["Education motion", "Learner audience", "Relevant trigger"],
    what_to_check_first: "No check recommended for this run.",
    evidence_notes: "Weak fit and no supported Brightspace use case.",
    matched_customer_story: null,
    recommended_actions: ["Suppress", "Do not draft outreach"],
    outreach_payload: {
      review_status: "needs_review",
      subject_line: "",
      email_body: "",
      review_flags: ["Suppressed record: no outreach payload"],
      fact_check_targets: [],
      suppression_reason:
        "No visible member education, credentialing, CE, or scalable training motion.",
    },
  },
];
