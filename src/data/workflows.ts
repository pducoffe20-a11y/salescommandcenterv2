import type { SourceConnection, WorkflowCardData } from "../types/workflow";

export const workflows: WorkflowCardData[] = [
  {
    id: "prospecting",
    name: "Brightspace New-Logo Prospecting Hub",
    purpose:
      "Rank net-new accounts by practical seller priority while keeping workbook evidence, assumptions, and gaps visible.",
    inputs: [
      "Account Mapping Workbook",
      "business-context.md",
      "target account lists",
    ],
    outputs: ["ranked worklist", "account brief", "seller action plan"],
    status: "Mock run complete · 5 accounts",
    accent: "teal",
  },
  {
    id: "prospects",
    name: "Prospect Strategy + Execution Dashboard",
    purpose:
      "Transform raw prospect inputs into review-safe JSON, then generate a browser-openable execution board.",
    inputs: ["CSV/XLSX", "raw tables", "strategy JSON"],
    outputs: [
      "outreach_preparation_payloads.json",
      "board_summary.json",
      "dashboard.html",
    ],
    status: "Needs review · 2 flags",
    accent: "blue",
  },
  {
    id: "precall",
    name: "Pre-Call Briefing Studio",
    purpose:
      "Turn sparse account context into a six-part D2L meeting brief and standalone prep app.",
    inputs: ["seller notes", "meeting type", "trigger event"],
    outputs: ["six-part brief", "copy-ready opener", "standalone HTML"],
    status: "Ready · sparse-context warnings",
    accent: "amber",
  },
  {
    id: "deals",
    name: "Deal Intelligence Studio",
    purpose:
      "Judge momentum, MEDDIC strength, risk, stakeholder coverage, and the best next buyer-facing move.",
    inputs: ["meeting notes", "email snippets", "proposal context"],
    outputs: ["deal dashboard", "exec brief", "execution package"],
    status: "Mixed momentum · 3 MEDDIC gaps",
    accent: "violet",
  },
  {
    id: "intent",
    name: "Intent Alert Follow-Up Studio",
    purpose:
      "Summarize mock Outlook alert emails, merge repeated account activity, and draft human-reviewed follow-up.",
    inputs: ["Outlook alerts", "customer story CSV"],
    outputs: ["account summaries", "Pat-style drafts", "markdown export"],
    status: "Mock only · 4 accounts extracted",
    accent: "red",
  },
];

export const sourceConnections: SourceConnection[] = [
  {
    name: "Outlook Email",
    state: "mock only",
    note: "Ready placeholder for alerts and thread context.",
  },
  {
    name: "Outlook Calendar",
    state: "needs setup",
    note: "Future meeting context source.",
  },
  {
    name: "Zoom",
    state: "not connected",
    note: "Prior call artifacts not retrieved in v1.",
  },
  {
    name: "Slack",
    state: "not connected",
    note: "Internal deal chatter placeholder.",
  },
  {
    name: "SharePoint",
    state: "mock only",
    note: "Enablement and customer story files mocked.",
  },
  {
    name: "Web search",
    state: "not connected",
    note: "Research prompts only; no live retrieval.",
  },
  {
    name: "Customer story files",
    state: "used in current run",
    note: "Mock matching only when credible.",
  },
  {
    name: "Account Mapping Workbook",
    state: "used in current run",
    note: "Workbook rows treated as starting points.",
  },
  {
    name: "Future Salesforce",
    state: "needs setup",
    note: "Will become authoritative for stage, amount, close date, and forecast.",
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
  status: index < 9 ? "complete" : index < 11 ? "review" : "ready",
  records: index < 2 ? 5 : 3,
  warnings: index === 3 ? 2 : index === 8 ? 1 : 0,
  gaps:
    index === 3
      ? "public research placeholders only"
      : index === 8
        ? "drafts need human review"
        : "none",
}));

export const boardSummary = {
  title: "D2L Brightspace Prospect Board",
  date_label: "July 3, 2026",
  total_records: 3,
  work_now_count: 2,
  light_research_count: 0,
  suppress_count: 1,
  key_themes: [
    "Credentialing modernization",
    "Member education reporting",
    "Suppress weak-fit records",
  ],
  evidence_gaps: ["Current platforms", "program timing", "budget owner"],
  manager_readout:
    "Two prospects are useful now, but both require timing validation before Pat sends anything.",
};
