export type WorkflowId = "prospecting" | "prospects" | "precall" | "deals" | "intent" | "exports" | "settings";
export type SourceState = "connected" | "not connected" | "mock only" | "needs setup" | "used in current run";
export type WorkStatus = "Work Now" | "Validate" | "Watch" | "Deprioritize";
export type ProspectStatus = "Work Now" | "Light Research" | "Suppress";

export interface WorkflowCardData {
  id: WorkflowId;
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  status: string;
  accent: string;
}

export interface SourceConnection {
  name: string;
  state: SourceState;
  note: string;
}

export interface TerritoryAccount {
  account_id: string;
  account_name: string;
  rank: number;
  priority_tier: string;
  priority_score: number;
  icp_fit_score: number;
  why_now_score: number;
  evidence_quality_score: number;
  brightspace_angle: string;
  status: WorkStatus;
  verified_facts: string[];
  workbook_inputs: string[];
  assumptions: string[];
  unknowns: string[];
  research_gaps: string[];
  likely_stakeholders: string[];
  risks: string[];
  disqualifiers: string[];
  recommended_next_action: string;
  recommended_first_touch: string;
  suggested_channel: string;
  confidence_level: string;
  source_notes: string[];
}

export interface StrategyRecord {
  prospect_id: string;
  full_name: string;
  title: string;
  organization: string;
  email: string;
  category: string;
  status: ProspectStatus;
  score_total: number;
  scores: { fit: number; urgency: number; persona: number; evidence: number };
  tenure_months: number | null;
  verified_facts: string[];
  inferred_pains: string[];
  unknowns: string[];
  what_to_check_first: string;
  evidence_notes: string;
  matched_customer_story: string | null;
  recommended_actions: string[];
  outreach_payload: {
    review_status: "needs_review";
    subject_line: string;
    email_body: string;
    review_flags: string[];
    fact_check_targets: string[];
    suppression_reason: string;
  };
}

export interface DealReview {
  account: string;
  opportunity: string;
  route: string;
  judgment: string;
  confidence: string;
  momentum: number;
  risk: number;
  stakeholderCoverage: number;
  evidence: number;
  meddic: Array<{ name: string; status: string; strength: string; confirmed: string[]; missing: string; next: string }>;
  signals: string[];
  risks: string[];
  stakeholders: Array<{ name: string; role: string; coverage: string; evidence: string }>;
  nextMoves: Array<{ who: string; why: string; angle: string; proof: string; outcome: string }>;
  gaps: string[];
}

export interface IntentAccount {
  name: string;
  evidenceStrength: string;
  repeatedActivity: string;
  urgencySignal: string;
  storyMatch: string | null;
  summary: string;
  rawEvidence: string[];
  draft: string;
}

export const workflows: WorkflowCardData[] = [
  {
    id: "prospecting",
    name: "Brightspace New-Logo Prospecting Hub",
    purpose: "Rank net-new accounts by practical seller priority while keeping workbook evidence, assumptions, and gaps visible.",
    inputs: ["Account Mapping Workbook", "business-context.md", "target account lists"],
    outputs: ["ranked worklist", "account brief", "seller action plan"],
    status: "Mock run complete - 5 accounts",
    accent: "teal",
  },
  {
    id: "prospects",
    name: "Prospect Strategy + Execution Dashboard",
    purpose: "Transform raw prospect inputs into review-safe JSON, then generate a browser-openable execution board.",
    inputs: ["CSV/XLSX", "raw tables", "strategy JSON"],
    outputs: ["outreach_preparation_payloads.json", "board_summary.json", "dashboard.html"],
    status: "Needs review - 2 flags",
    accent: "blue",
  },
  {
    id: "precall",
    name: "Pre-Call Briefing Studio",
    purpose: "Turn sparse account context into a six-part D2L meeting brief and standalone prep app.",
    inputs: ["seller notes", "meeting type", "trigger event"],
    outputs: ["six-part brief", "copy-ready opener", "standalone HTML"],
    status: "Ready - sparse-context warnings",
    accent: "amber",
  },
  {
    id: "deals",
    name: "Deal Intelligence Studio",
    purpose: "Judge momentum, MEDDIC strength, risk, stakeholder coverage, and the best next buyer-facing move.",
    inputs: ["meeting notes", "email snippets", "proposal context"],
    outputs: ["deal dashboard", "exec brief", "execution package"],
    status: "Mixed momentum - 3 MEDDIC gaps",
    accent: "violet",
  },
  {
    id: "intent",
    name: "Intent Alert Follow-Up Studio",
    purpose: "Summarize mock Outlook alert emails, merge repeated account activity, and draft human-reviewed follow-up.",
    inputs: ["Outlook alerts", "customer story CSV"],
    outputs: ["account summaries", "Pat-style drafts", "markdown export"],
    status: "Mock only - 4 accounts extracted",
    accent: "red",
  },
];

export const sourceConnections: SourceConnection[] = [
  { name: "Outlook Email", state: "mock only", note: "Ready placeholder for alerts and thread context." },
  { name: "Outlook Calendar", state: "needs setup", note: "Future meeting context source." },
  { name: "Zoom", state: "not connected", note: "Prior call artifacts not retrieved in v1." },
  { name: "Slack", state: "not connected", note: "Internal deal chatter placeholder." },
  { name: "SharePoint", state: "mock only", note: "Enablement and customer story files mocked." },
  { name: "Web search", state: "not connected", note: "Research prompts only; no live retrieval." },
  { name: "Customer story files", state: "used in current run", note: "Mock matching only when credible." },
  { name: "Account Mapping Workbook", state: "used in current run", note: "Workbook rows treated as starting points." },
  { name: "Future Salesforce", state: "needs setup", note: "Will become authoritative for stage, amount, close date, and forecast." },
];

export const territoryAccounts: TerritoryAccount[] = [
  {
    account_id: "aamc",
    account_name: "Alliance for Applied Manufacturing Credentials",
    rank: 1,
    priority_tier: "Tier 1",
    priority_score: 91,
    icp_fit_score: 92,
    why_now_score: 86,
    evidence_quality_score: 80,
    brightspace_angle: "certification",
    status: "Work Now",
    verified_facts: ["Workbook marks this as a credentialing body with national reach.", "Provided notes mention member certification refresh."],
    workbook_inputs: ["Segment: association / credentialing", "Top-list score: 88"],
    assumptions: ["Certification modernization may need better learner reporting."],
    unknowns: ["Current LMS vendor", "Budget owner", "Renewal window"],
    research_gaps: ["Validate certification volume", "Find education or certification leader"],
    likely_stakeholders: ["VP Certification", "Director of Member Education"],
    risks: ["Spreadsheet fit may overstate urgency."],
    disqualifiers: [],
    recommended_next_action: "Validate certification refresh and identify the program owner before pitching.",
    recommended_first_touch: "Ask whether the certification refresh includes delivery, tracking, or reporting changes.",
    suggested_channel: "Email then LinkedIn",
    confidence_level: "Medium-high",
    source_notes: ["No public research retrieved in v1."],
  },
  {
    account_id: "ncha",
    account_name: "North Coast Healthcare Association",
    rank: 2,
    priority_tier: "Tier 1",
    priority_score: 87,
    icp_fit_score: 89,
    why_now_score: 82,
    evidence_quality_score: 76,
    brightspace_angle: "CE / CME / CPD",
    status: "Work Now",
    verified_facts: ["Input list identifies healthcare association.", "Seller notes mention continuing education programming."],
    workbook_inputs: ["Vertical: healthcare", "Member education noted"],
    assumptions: ["CE delivery may require audit-friendly completion reporting."],
    unknowns: ["Accreditation requirements", "Course catalog scale"],
    research_gaps: ["Confirm CE ownership", "Check whether programs are member-only or revenue-generating"],
    likely_stakeholders: ["Director of Education", "Chief Membership Officer"],
    risks: ["Healthcare label alone is not proof of active CE need."],
    disqualifiers: [],
    recommended_next_action: "Send a validation note around CE reporting and member engagement.",
    recommended_first_touch: "Ask who owns CE experience and completion reporting this year.",
    suggested_channel: "Email",
    confidence_level: "Medium",
    source_notes: ["Customer story match is plausible but unverified."],
  },
  {
    account_id: "summitcare",
    account_name: "SummitCare Clinical Network",
    rank: 3,
    priority_tier: "Tier 2",
    priority_score: 78,
    icp_fit_score: 82,
    why_now_score: 73,
    evidence_quality_score: 68,
    brightspace_angle: "compliance training",
    status: "Validate",
    verified_facts: ["Workbook names a healthcare clinical education motion.", "Internal context says staff onboarding is distributed."],
    workbook_inputs: ["Employee count range: 2,500-5,000", "Training notes: clinical onboarding"],
    assumptions: ["Compliance content may be hard to govern across sites."],
    unknowns: ["Whether they sell education externally", "Current compliance platform"],
    research_gaps: ["Confirm training owner", "Find current clinical education initiatives"],
    likely_stakeholders: ["Clinical Education Director", "HR Learning Leader"],
    risks: ["May be better fit for internal L&D than Brightspace core story."],
    disqualifiers: [],
    recommended_next_action: "Validate whether clinical education is centralized enough for a platform conversation.",
    recommended_first_touch: "Ask about training governance across sites, not a demo.",
    suggested_channel: "LinkedIn research first",
    confidence_level: "Medium",
    source_notes: ["Thin evidence; mark as validate before outreach."],
  },
  {
    account_id: "globalforge",
    account_name: "GlobalForge Industries",
    rank: 4,
    priority_tier: "Tier 3",
    priority_score: 64,
    icp_fit_score: 70,
    why_now_score: 59,
    evidence_quality_score: 52,
    brightspace_angle: "workforce enablement",
    status: "Watch",
    verified_facts: ["Workbook tags corporate workforce development."],
    workbook_inputs: ["Segment: corporate", "Region: North America"],
    assumptions: ["Partner or customer training could exist but is not shown."],
    unknowns: ["Training use case", "Learner audience", "Executive sponsor"],
    research_gaps: ["Find a named learning initiative", "Check if external education exists"],
    likely_stakeholders: ["L&D Director"],
    risks: ["Brightspace value story is generic without a named learning motion."],
    disqualifiers: [],
    recommended_next_action: "Hold for a stronger trigger or find a public training initiative.",
    recommended_first_touch: "Do not draft until use case is clearer.",
    suggested_channel: "Watchlist",
    confidence_level: "Low-medium",
    source_notes: ["No outreach-ready evidence."],
  },
  {
    account_id: "localprint",
    account_name: "LocalPrint Services",
    rank: 5,
    priority_tier: "Tier 4",
    priority_score: 28,
    icp_fit_score: 25,
    why_now_score: 18,
    evidence_quality_score: 35,
    brightspace_angle: "training scale",
    status: "Deprioritize",
    verified_facts: ["Provided list includes small business services account."],
    workbook_inputs: ["No education motion noted"],
    assumptions: ["Could have internal training, but no evidence supports Brightspace fit."],
    unknowns: ["Training need", "Scale", "Stakeholder"],
    research_gaps: ["None worth prioritizing now"],
    likely_stakeholders: [],
    risks: ["Low fit and no why-now signal."],
    disqualifiers: ["No visible member, credentialing, CE, customer training, or workforce education motion."],
    recommended_next_action: "Suppress from this run and preserve reason.",
    recommended_first_touch: "No outreach recommended.",
    suggested_channel: "Suppress",
    confidence_level: "High",
    source_notes: ["Deprioritization is based on weak provided evidence, not a confirmed no-fit claim."],
  },
];

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
    verified_facts: ["Provided title owns certification programs.", "Organization appears in credentialing target list."],
    inferred_pains: ["Certification delivery and reporting may need clearer governance."],
    unknowns: ["Current delivery platform", "Certification refresh timing"],
    what_to_check_first: "Confirm whether certification delivery is being refreshed this year.",
    evidence_notes: "Strong persona and category fit; timing still needs validation.",
    matched_customer_story: "Credentialing association modernization story",
    recommended_actions: ["Send short validation email", "Find certification catalog page", "Create 3-day follow-up task"],
    outreach_payload: {
      review_status: "needs_review",
      subject_line: "Question on certification delivery",
      email_body: "Maren - saw your role connects closely to certification programs. If your team is looking at delivery or reporting changes this year, it may be worth comparing notes on what other credentialing groups simplify first. Open to a short conversation next week?",
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
    verified_facts: ["Provided role mentions member learning.", "Healthcare association appears in account list."],
    inferred_pains: ["CE reporting and member engagement may be active concerns."],
    unknowns: ["CE accreditation requirements", "Member portal ownership"],
    what_to_check_first: "Check whether CE/CME programs are listed publicly.",
    evidence_notes: "Useful target with plausible CE angle; no live research in v1.",
    matched_customer_story: "Healthcare education program story",
    recommended_actions: ["Validate CE scope", "Draft low-pressure note", "Save as work-now prospect"],
    outreach_payload: {
      review_status: "needs_review",
      subject_line: "Member education question",
      email_body: "Theo - I noticed your work is tied to member learning. If CE reporting or learner engagement is becoming more important this year, I would be glad to compare notes on how similar teams keep the experience simple. Would a quick fit check be useful?",
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
      suppression_reason: "No visible member education, credentialing, CE, or scalable training motion.",
    },
  },
];

export const pipelineStages = [
  "Intake",
  "Normalize",
  "Enrich",
  "Research",
  "Score",
  "Classify",
  "Sequence",
  "Story Match",
  "Outreach Prep",
  "Review Handoff",
  "JSON Export",
  "Dashboard Build",
].map((name, index) => ({
  name,
  status: index < 10 ? "complete" : index === 10 ? "active" : "queued",
  records: index < 10 ? 3 : 0,
  warnings: index === 3 || index === 8 ? 2 : 0,
  gaps: index === 3 ? "Current platforms unknown" : index === 8 ? "Drafts need review" : "No material gap",
}));

export const boardSummary = {
  title: "D2L Brightspace Prospect Board",
  date_label: "July 3, 2026",
  total_records: 3,
  work_now_count: 2,
  light_research_count: 0,
  suppress_count: 1,
  key_themes: ["Credentialing modernization", "Member education reporting", "Suppress weak-fit records"],
  evidence_gaps: ["Current platforms", "program timing", "budget owner"],
  manager_readout: "Two prospects are useful now, but both require timing validation before Pat sends anything.",
};

export const dealReviews: DealReview[] = [
  {
    account: "North Coast Healthcare Association",
    opportunity: "Member CE modernization",
    route: "Interactive Dashboard",
    judgment: "Promising but not yet forecastable: education pain is plausible, economic ownership is unconfirmed.",
    confidence: "Medium",
    momentum: 72,
    risk: 41,
    stakeholderCoverage: 58,
    evidence: 64,
    meddic: [
      { name: "Metrics", status: "Partial", strength: "Medium", confirmed: ["Seller notes cite reporting burden."], missing: "No quantified CE completion or admin-time metric.", next: "Ask what reporting task consumes the most time." },
      { name: "Economic buyer", status: "Gap", strength: "Low", confirmed: [], missing: "Budget owner not confirmed.", next: "Identify whether education, membership, or finance owns budget." },
      { name: "Decision criteria", status: "Inferred", strength: "Medium", confirmed: ["Member learning is the stated motion."], missing: "No confirmed selection criteria.", next: "Ask what would make a platform change worth the effort." },
      { name: "Decision process", status: "Gap", strength: "Low", confirmed: [], missing: "No process, timeline, or procurement path.", next: "Ask who would need to weigh in if the use case is real." },
      { name: "Identify pain", status: "Partial", strength: "Medium", confirmed: ["CE/member learning context is provided."], missing: "Pain is not validated by buyer words.", next: "Use discovery to test reporting and engagement hypotheses." },
      { name: "Champion", status: "Unproven", strength: "Low", confirmed: [], missing: "No champion behavior yet.", next: "Look for a contact willing to define the problem." },
    ],
    signals: ["Member learning role exists", "Healthcare CE angle could be credible", "Customer story match is plausible but not definitive"],
    risks: ["No confirmed budget owner", "No decision process", "Could be content issue rather than platform issue"],
    stakeholders: [
      { name: "Theo Grant", role: "Director of Member Learning", coverage: "Known contact", evidence: "Provided prospect input" },
      { name: "Finance / COO", role: "Economic buyer candidate", coverage: "Unknown", evidence: "Inference only" },
    ],
    nextMoves: [{ who: "Theo Grant", why: "He is the clearest education stakeholder", angle: "Validate CE reporting and member engagement pressure", proof: "Use healthcare education story only as a light example", outcome: "Confirm whether a working session is useful" }],
    gaps: ["Budget owner", "current platform", "CE program scale"],
  },
  {
    account: "Alliance for Applied Manufacturing Credentials",
    opportunity: "Certification program refresh",
    route: "Structured Deal Review",
    judgment: "Best near-term new-logo path if certification refresh is real; avoid assuming urgency until timing is verified.",
    confidence: "Medium-high",
    momentum: 79,
    risk: 33,
    stakeholderCoverage: 62,
    evidence: 70,
    meddic: [],
    signals: ["Certification persona identified", "Workbook category fit is strong", "Likely education revenue angle"],
    risks: ["Refresh timing not confirmed", "No current vendor evidence"],
    stakeholders: [{ name: "Maren Ortiz", role: "VP, Certification Programs", coverage: "Primary", evidence: "Provided prospect record" }],
    nextMoves: [{ who: "Maren Ortiz", why: "Certification ownership is likely relevant", angle: "Ask whether delivery/reporting changes are in scope", proof: "Credentialing modernization example", outcome: "Validate discovery meeting" }],
    gaps: ["Current delivery model", "certification volume", "decision team"],
  },
];

export const intentAccounts: IntentAccount[] = [
  {
    name: "Pinnacle Safety Institute",
    evidenceStrength: "Medium",
    repeatedActivity: "Appeared in 2 mock alerts",
    urgencySignal: "Training scale + compliance topics",
    storyMatch: "Compliance training customer story",
    summary: "Activity could point to a compliance training review. The evidence is account-level only, so Pat should test whether training governance is actually on the table.",
    rawEvidence: ["Mock alert 2026-07-01: compliance training keywords", "Mock alert 2026-07-03: learning platform comparison topic"],
    draft: "Hi Jordan - I saw Pinnacle is continuing to invest in safety education, and it made me wonder whether training governance is becoming harder as programs grow. We work with teams that need cleaner ways to deliver and report on required learning without making the learner experience heavier. If that is remotely relevant, would it be useful to compare notes for 15 minutes?",
  },
  {
    name: "Civic Credentialing Board",
    evidenceStrength: "High",
    repeatedActivity: "Appeared in 3 mock alerts",
    urgencySignal: "Certification and assessment topics repeated",
    storyMatch: "Credentialing modernization story",
    summary: "Repeated credentialing language makes this the strongest mock follow-up candidate, but timing and owner still need validation.",
    rawEvidence: ["Mock alert 2026-06-29: certification management", "Mock alert 2026-07-02: exam prep content", "Mock alert 2026-07-03: learner reporting"],
    draft: "Hi Avery - your certification programs look like the kind of education experience where delivery and reporting can get complicated quickly. If your team is looking at ways to simplify that experience this year, I would be glad to share what similar credentialing groups tend to evaluate first. Open to a quick fit check next week?",
  },
  {
    name: "Greenfield Employers Council",
    evidenceStrength: "Thin",
    repeatedActivity: "Single mock alert",
    urgencySignal: "Broad workforce learning topic",
    storyMatch: null,
    summary: "The signal is too broad to treat as urgency. Keep the note exploratory and avoid a customer story.",
    rawEvidence: ["Mock alert 2026-07-02: workforce development topic only"],
    draft: "Hi Sam - I noticed Greenfield's work sits close to workforce education, and I had a simple question. Are you looking at member or employer training programs this year, or is that not a current focus? If it is on the radar, I would be happy to compare notes.",
  },
];

export const runHistory = [
  { workflow: "Prospecting Hub", date: "Jul 3, 2026", source: "Account Mapping Workbook FINAL.xlsx", output: "Ranked worklist + account brief", status: "Complete" },
  { workflow: "Strategy Dashboard", date: "Jul 3, 2026", source: "Credentialing targets paste", output: "JSON payload + dashboard.html", status: "Needs review" },
  { workflow: "Deal Intelligence", date: "Jul 2, 2026", source: "Seller notes", output: "MEDDIC dashboard", status: "Evidence gaps" },
  { workflow: "Intent Alerts", date: "Jul 1, 2026", source: "Mock Outlook alerts", output: "Summaries + drafts", status: "Mock only" },
];
