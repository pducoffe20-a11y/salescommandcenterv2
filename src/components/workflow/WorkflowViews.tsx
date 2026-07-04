import { useMemo, useState } from "react";
import { Activity, ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardCopy, Database, Download, FileJson, FileText, Gauge, RadioTower, Search, Settings, Sparkles, Users } from "lucide-react";
import { seedSalesData, type NormalizedSalesData } from "../../services/agentImports";
import { dealReviews, intentAccounts, pipelineStages, runHistory, sourceConnections, strategyRecords, territoryAccounts, workflows, type WorkflowId, type TerritoryAccount, type StrategyRecord, type IntentAccount } from "../../workflowData";
import type { View } from "../../router/appRouter";

export function HomeView({ onLaunch, commandCenterData }: { onLaunch: (id: View) => void; commandCenterData: NormalizedSalesData }) {
  return <div className="workflow-page">
    <section className="mission-hero"><div><span className="eyebrow">D2L Brightspace agentic workflow home</span><h1>Mission control for outbound judgment.</h1><p>Organize Pat's ChatGPT-built seller agents into one evidence-aware command center for prioritization, strategy, meeting prep, deal review, and timely follow-up.</p><div className="hero-actions"><button className="primary-button" onClick={() => onLaunch("prospecting")}><Sparkles size={18}/> Start prospecting run</button><button className="secondary-button" onClick={() => onLaunch("settings")}>Review source readiness</button></div></div><EvidenceRail /></section>
    <section className="workflow-card-grid">{workflows.map((w) => <article className={`workflow-card accent-${w.accent}`} key={w.id}><div className="card-topline"><span>{w.status}</span><Activity size={18}/></div><h2>{w.name}</h2><p>{w.purpose}</p><div className="io-grid"><MiniList title="Inputs" items={w.inputs}/><MiniList title="Outputs" items={w.outputs}/></div><button className="text-button" onClick={() => onLaunch(w.id)}>Launch workflow <ArrowRight size={16}/></button></article>)}</section>
    <section className="two-panel"><RunHistory commandCenterData={commandCenterData} /><SourcePanel compact /></section>
  </div>;
}

function EvidenceRail() { return <aside className="evidence-rail"><strong>Non-negotiables</strong>{["No invented evidence", "Assumptions labeled", "JSON is strategy truth", "No autonomous sending", "Future connectors are placeholders"].map((x) => <span className="status-chip" key={x}><CheckCircle2 size={14}/>{x}</span>)}</aside>; }
function MiniList({ title, items }: { title: string; items: string[] }) { return <div><span className="eyebrow">{title}</span>{items.map((i) => <p key={i}>{i}</p>)}</div>; }
function RunHistory({ commandCenterData }: { commandCenterData?: NormalizedSalesData }) { const promotedRuns = commandCenterData ? buildPromotedRuns(commandCenterData) : []; return <section className="panel module-panel"><div className="section-heading"><div><span className="eyebrow">Run history</span><h2>Recent mock workflow runs</h2></div><Gauge size={20}/></div><div className="table-list">{[...promotedRuns, ...runHistory].map((r) => <div className="table-row" key={`${r.workflow}-${r.date}-${r.output}`}><strong>{r.workflow}</strong><span>{r.date}</span><span>{r.source}</span><span>{r.output}</span><em>{r.status}</em><button className="text-button">Reopen</button></div>)}</div></section>; }
function SourcePanel({ compact = false }: { compact?: boolean }) { return <section className="panel module-panel"><div className="section-heading"><div><span className="eyebrow">Integration readiness</span><h2>Source placeholders</h2></div><Database size={20}/></div><div className={compact ? "source-grid compact" : "source-grid"}>{sourceConnections.map((s) => <div className="source-card" key={s.name}><strong>{s.name}</strong><span className={`source-state state-${s.state.replace(/ /g, "-")}`}>{s.state}</span><p>{s.note}</p></div>)}</div></section>; }

export function ProspectingView({ selected, onSelect, copy, commandCenterData }: { selected: TerritoryAccount; onSelect: (a: TerritoryAccount) => void; copy: (text: string, label?: string) => void; commandCenterData: NormalizedSalesData }) {
  const groups = ["Work Now", "Validate", "Watch", "Deprioritize"] as const;
  return <div className="workflow-page"><PageHeader eyebrow="Module 1" title="Brightspace New-Logo Prospecting Hub" body="Rank net-new accounts by practical priority, show the evidence, and keep workbook assumptions from becoming fake truth." />
    <section className="panel module-panel intake-grid"><IntakeCard title="Territory intake" fields={["Upload workbook", "Upload account list", "Paste account names", "Territory segment", "Output type", "Depth: quick / deep / deeper"]}/><KpiStrip items={[ ["Work Now", "2"], ["Validate", "1"], ["Evidence avg", "62"], ["Weak fit suppressed", "1"] ]}/></section>
    <section className="board-grid">{groups.map((g) => <div className="board-column" key={g}><h2>{g}</h2>{territoryAccounts.filter((a) => a.status === g).map((a) => <button className={`account-work-card ${selected.account_id === a.account_id ? "active" : ""}`} onClick={() => onSelect(a)} key={a.account_id}><span className="rank">#{a.rank}</span><div><strong>{a.account_name}</strong><p>{a.brightspace_angle} · score {a.priority_score}</p><ScoreBars a={a}/></div></button>)}</div>)}</section>
    <PromotedProspectingPanel commandCenterData={commandCenterData} />
    <section className="detail-drawer panel"><div className="section-heading"><div><span className="eyebrow">Account detail drawer</span><h2>{selected.account_name}</h2><p>{selected.recommended_next_action}</p></div><button className="text-button" onClick={() => copy(JSON.stringify(selected, null, 2), "Account JSON copied")}><FileJson size={16}/> Copy JSON</button></div><EvidenceColumns account={selected}/></section>
  </div>;
}
function ScoreBars({ a }: { a: TerritoryAccount }) { return <div className="mini-bars"><span style={{width:`${a.icp_fit_score}%`}}>ICP</span><span style={{width:`${a.why_now_score}%`}}>Why-now</span><span style={{width:`${a.evidence_quality_score}%`}}>Evidence</span></div>; }
function EvidenceColumns({ account }: { account: TerritoryAccount }) { const sections = [["Verified facts", account.verified_facts], ["Workbook inputs", account.workbook_inputs], ["Assumptions", account.assumptions], ["Unknowns", account.unknowns], ["Research gaps", account.research_gaps], ["Likely stakeholders", account.likely_stakeholders], ["Risks", account.risks], ["Disqualifiers", account.disqualifiers.length ? account.disqualifiers : ["None shown in mock data"]], ["Source notes", account.source_notes]]; return <div className="evidence-columns">{sections.map(([title, items]) => <div className="evidence-box" key={title as string}><h3>{title as string}</h3><ul>{(items as string[]).map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div>; }

export function StrategyView({ selected, onSelect, copy }: { selected: StrategyRecord; onSelect: (p: StrategyRecord) => void; copy: (text: string, label?: string) => void }) {
  const payload = { generated_at: "2026-07-03T12:00:00Z", source_name: "Credentialing targets paste", workflow_stage: "review_handoff", records: strategyRecords };
  return <div className="workflow-page"><PageHeader eyebrow="Module 2" title="Prospect Strategy + Seller Execution Dashboard" body="Raw input becomes conservative strategy JSON; dashboard HTML remains the execution layer, not the source of truth." />
    <section className="panel module-panel"><div className="pipeline">{pipelineStages.map((s, i) => <div className={`pipeline-step ${s.status}`} key={s.name}><span>{i + 1}</span><strong>{s.name}</strong><small>{s.records} records · {s.warnings} warnings</small><em>{s.gaps}</em></div>)}</div></section>
    <section className="strategy-layout"><div className="review-board panel module-panel"><div className="section-heading"><div><span className="eyebrow">Strategy review board</span><h2>Execution status</h2></div></div>{(["Work Now", "Light Research", "Suppress"] as const).map((status) => <div className="status-group" key={status}><h3>{status}</h3>{strategyRecords.filter((r) => r.status === status).map((r) => <button className="prospect-row" onClick={() => onSelect(r)} key={r.prospect_id}><strong>{r.full_name}</strong><span>{r.title}</span><span>{r.organization}</span><ScorePill score={r.score_total}/></button>)}</div>)}</div><JsonPanel payload={payload} copy={copy}/></section>
    <section className="detail-drawer panel"><div className="section-heading"><div><span className="eyebrow">Prospect detail drawer</span><h2>{selected.full_name}</h2><p>{selected.what_to_check_first}</p></div><span className="status-chip">{selected.outreach_payload.review_status}</span></div><div className="detail-grid"><Detail title="Score breakdown" items={[`Fit ${selected.scores.fit}`, `Urgency ${selected.scores.urgency}`, `Persona ${selected.scores.persona}`, `Evidence ${selected.scores.evidence}`]}/><Detail title="Verified facts" items={selected.verified_facts}/><Detail title="Inferred pains" items={selected.inferred_pains}/><Detail title="Unknowns" items={selected.unknowns}/><Detail title="Review flags" items={selected.outreach_payload.review_flags}/><MessagePreview record={selected} copy={copy}/></div></section>
  </div>;
}
function ScorePill({ score }: { score: number }) { return <span className="score-pill">{score}</span>; }
function JsonPanel({ payload, copy }: { payload: unknown; copy: (text: string, label?: string) => void }) { const text = JSON.stringify(payload, null, 2); return <section className="panel module-panel json-panel"><div className="section-heading"><div><span className="eyebrow">JSON output center</span><h2>outreach_preparation_payloads.json</h2></div><button className="text-button" onClick={() => copy(text, "JSON copied")}><ClipboardCopy size={16}/> Copy</button></div><pre>{text}</pre></section>; }
function MessagePreview({ record, copy }: { record: StrategyRecord; copy: (text: string, label?: string) => void }) { return <div className="evidence-box"><h3>Review-safe outreach payload</h3><strong>{record.outreach_payload.subject_line || "No draft for suppressed record"}</strong><p>{record.outreach_payload.email_body || record.outreach_payload.suppression_reason}</p><button className="text-button" onClick={() => copy(record.outreach_payload.email_body, "Draft copied")}>Copy draft</button></div>; }

export function PreCallView({ copy }: { copy: (text: string, label?: string) => void }) {
  const [meetingType, setMeetingType] = useState("Discovery");
  const sections = useMemo(() => [
    ["Account Snapshot", "Grounded: healthcare association and CE context are provided. Inference: the opportunity may involve reporting and member learner engagement. Open question: whether this is a platform priority now."],
    ["Contact Angle", "Likely education owner. Engage with practical questions about program delivery, completion reporting, and what would make change worth the effort."],
    ["D2L Value Angles", "1. Simplify CE learner experience without adding admin work.\n2. Improve reporting/governance for member education.\n3. Support reusable content paths as programs expand."],
    ["Discovery Questions", "1. What part of member education is hardest to manage today? Why: finds real pain.\n2. How do you track completion and engagement? Why: validates reporting need.\n3. Who owns the learner experience? Why: maps stakeholders.\n4. What would make change worth the lift? Why: tests urgency.\n5. What should we avoid assuming? Why: keeps uncertainty visible."],
    ["Likely Objections", "1. We are not ready for a platform change — Counter: narrow to one workflow.\n2. Reporting is not the main issue — Reframe: ask which education process is.\n3. Budget is unclear — Follow-up: ask who would sponsor a small evaluation."],
    ["Opener + Next Step Ask", "Thanks for making time. I thought we could keep this practical: understand what your team is trying to improve in member education, pressure-test whether Brightspace is relevant, and decide if there is a small next step worth taking. If useful, the light next step could be a 25-minute working session around one CE workflow."],
  ], []);
  return <div className="workflow-page"><PageHeader eyebrow="Module 3" title="Pre-Call Briefing Studio" body="A calm sales prep cockpit that produces the required six-part brief and a standalone HTML artifact placeholder." />
    <section className="precall-layout"><div className="panel module-panel tool-form"><h2>Context intake</h2>{["Account", "Contact", "Title", "Vertical", "Trigger event", "Desired next step"].map((f) => <label key={f}>{f}<input defaultValue={f === "Account" ? "North Coast Healthcare Association" : ""}/></label>)}<label>Meeting type<select value={meetingType} onChange={(e) => setMeetingType(e.target.value)}>{["Discovery", "First meeting", "Demo prep", "Follow-up", "Renewal / expansion", "Executive conversation"].map((m) => <option key={m}>{m}</option>)}</select></label><textarea defaultValue="Sparse notes: member learning leader, possible CE reporting angle, no confirmed budget or platform."/><Readiness /></div><div className="panel module-panel"><div className="section-heading"><div><span className="eyebrow">Source context</span><h2>Mock source mode</h2></div></div><div className="source-grid compact">{["User-provided context: used", "Outlook Calendar: not connected", "Outlook Email: not used", "Zoom: not connected"].map((s) => <div className="source-card" key={s}><strong>{s}</strong><p>Placeholder only for v1.</p></div>)}</div><Checklist type={meetingType}/></div></section>
    <section className="brief-output">{sections.map(([heading, body]) => <article className="brief-section-card" key={heading}><div><h2>{heading}</h2><span className="status-chip">confidence: medium</span></div><p>{body}</p><details><summary>Rationale</summary><p>Separates grounded facts, inference, and open questions. No connector retrieval in v1.</p></details><button className="text-button" onClick={() => copy(`${heading}\n${body}`, "Section copied")}>Copy section</button></article>)}</section>
  </div>;
}
function Readiness() { return <div><div className="meter-track"><span style={{width:"72%"}} /></div><p>Prep completeness: 72%. Thin-context warning: budget, current platform, and decision process are unknown.</p></div>; }
function Checklist({ type }: { type: string }) { const base = ["Confirm objective", "Name known facts", "Label assumptions", "Prepare soft next step"]; return <div className="check-panel"><h3>{type} checklist</h3>{base.map((b, i) => <label className="check-row" key={b}><input type="checkbox" defaultChecked={i < 2}/>{b}</label>)}</div>; }

export function DealsView({ dealIndex, setDealIndex, copy, commandCenterData }: { dealIndex: number; setDealIndex: (n: number) => void; copy: (text: string, label?: string) => void; commandCenterData: NormalizedSalesData }) {
  const deal = dealReviews[dealIndex];
  return <div className="workflow-page deal-mode"><PageHeader eyebrow="Module 4" title="Deal Intelligence Studio" body="Dark-mode deal command center for momentum, MEDDIC gaps, stakeholder coverage, and the next buyer-facing move." />
    <section className="deal-selector">{dealReviews.map((d, i) => <button className={`secondary-button ${i === dealIndex ? "active" : ""}`} onClick={() => setDealIndex(i)} key={d.account}>{d.account}</button>)}</section>
    <section className="deal-dashboard panel"><div className="section-heading"><div><span className="eyebrow">Executive takeaway</span><h2>{deal.judgment}</h2><p>Confidence: {deal.confidence}. Salesforce is not connected; stage, amount, close date, and forecast are evidence gaps unless provided manually.</p></div><button className="text-button" onClick={() => copy(JSON.stringify(deal, null, 2), "Deal JSON copied")}>Copy review</button></div><KpiStrip items={[["Momentum", `${deal.momentum}`], ["Risk", `${deal.risk}`], ["Coverage", `${deal.stakeholderCoverage}`], ["Evidence", `${deal.evidence}`]]}/><div className="deal-grid"><Detail title="Top signals" items={deal.signals}/><Detail title="Risks and blockers" items={deal.risks}/><Detail title="Missing evidence" items={deal.gaps}/><Detail title="Recommended next moves" items={deal.nextMoves.map((m) => `${m.who}: ${m.angle} → ${m.outcome}`)}/></div><PromotedDealPanel commandCenterData={commandCenterData} /><div className="meddic-grid">{(deal.meddic.length ? deal.meddic : dealReviews[0].meddic).map((m) => <article className="meddic-card" key={m.name}><strong>{m.name}</strong><span>{m.status} · {m.strength}</span><p>{m.missing}</p><em>{m.next}</em></article>)}</div></section>
  </div>;
}

export function IntentView({ selected, onSelect, copy, commandCenterData }: { selected: IntentAccount; onSelect: (a: IntentAccount) => void; copy: (text: string, label?: string) => void; commandCenterData: NormalizedSalesData }) {
  return <div className="workflow-page"><PageHeader eyebrow="Module 5" title="Intent Alert Follow-Up Studio" body="Mock Outlook alert emails become account summaries and short Pat-style drafts. Outreach never mentions 6sense, tracking, or monitoring." />
    <section className="panel module-panel intake-grid"><IntakeCard title="Run setup" fields={["Lookback: last 7 days", "Sender: abm-alerts@6sense.com", "Story matching: on", "Output: Markdown + JSON"]}/><KpiStrip items={[["Emails found", "3"], ["Accounts", "3"], ["Repeated", "2"], ["Drafts", "3"]]}/></section>
    <section className="intent-layout"><div className="panel module-panel"><h2>Account coverage</h2>{intentAccounts.map((a) => <button className="intent-row" key={a.name} onClick={() => onSelect(a)}><strong>{a.name}</strong><span>{a.evidenceStrength}</span><span>{a.repeatedActivity}</span><span>{a.storyMatch ?? "No forced story"}</span></button>)}</div><div className="panel module-panel"><div className="section-heading"><div><span className="eyebrow">Account detail drawer</span><h2>{selected.name}</h2></div><button className="text-button" onClick={() => copy(selected.draft, "Draft copied")}>Copy draft</button></div><Detail title="Raw alert evidence" items={selected.rawEvidence}/><h3>Plain-language sales takeaway</h3><p>{selected.summary}</p><h3>Outreach draft</h3><p className="message-box">{selected.draft}</p></div></section><PromotedIntentPanel commandCenterData={commandCenterData} />
  </div>;
}

export function ExportsView({ copy }: { copy: (text: string, label?: string) => void }) { const exports = ["JSON payloads", "CSV worklists", "Markdown briefs", "TXT summaries", "Self-contained HTML dashboards"]; return <div className="workflow-page"><PageHeader eyebrow="Export center" title="Download and copy mock artifacts" body="Export actions are simulated for v1, with clean seams for future generated files and standalone HTML dashboards."/><section className="export-grid">{exports.map((e) => <article className="panel module-panel export-card" key={e}><FileJson size={22}/><h2>{e}</h2><p>Mock export package. Future backend can replace this with real file generation.</p><button className="text-button" onClick={() => copy(`${e} mock export`, `${e} copied`)}><Download size={16}/> Export</button></article>)}</section></div>; }
export function SettingsView() { return <div className="workflow-page"><PageHeader eyebrow="Settings" title="Source and integration readiness" body="No live retrieval is enabled. These cards define future connection points for Outlook, Zoom, Slack, SharePoint, web search, customer stories, workbook parsing, and Salesforce."/><SourcePanel /></div>; }
function PageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) { return <header className="tool-header"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{body}</p></header>; }
function IntakeCard({ title, fields }: { title: string; fields: string[] }) { return <div><span className="eyebrow">Mock controls</span><h2>{title}</h2><div className="field-chips">{fields.map((f) => <span className="status-chip" key={f}>{f}</span>)}</div></div>; }
function KpiStrip({ items }: { items: string[][] }) { return <div className="kpi-strip module-kpis">{items.map(([label, value]) => <div className="kpi-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>; }
function Detail({ title, items }: { title: string; items: string[] }) { return <div className="evidence-box"><h3>{title}</h3><ul>{items.map((i) => <li key={i}>{i}</li>)}</ul></div>; }

function PromotedProspectingPanel({ commandCenterData }: { commandCenterData: NormalizedSalesData }) {
  const promotedAccounts = commandCenterData.accounts.filter(
    (account) => !territoryAccounts.some((seed) => seed.account_name === account.name),
  );

  if (!promotedAccounts.length) return null;

  return <section className="panel module-panel"><div className="section-heading"><div><span className="eyebrow">Promoted command center accounts</span><h2>Imported prospecting work</h2></div></div><div className="board-grid">{promotedAccounts.map((account) => <article className="account-work-card" key={account.id}><span className="rank">★</span><div><strong>{account.name}</strong><p>{account.recommendedAction}</p><ScoreBars a={{ icp_fit_score: account.fitScore, why_now_score: account.timingScore, evidence_quality_score: account.momentumScore } as TerritoryAccount}/></div></article>)}</div></section>;
}

function PromotedDealPanel({ commandCenterData }: { commandCenterData: NormalizedSalesData }) {
  const seedTaskIds = new Set(seedSalesData.tasks.map((task) => task.id));
  const seedMeetingIds = new Set(seedSalesData.meetings.map((meeting) => meeting.id));
  const promotedTasks = commandCenterData.tasks.filter((task) => !seedTaskIds.has(task.id)).slice(-5);
  const promotedMeetings = commandCenterData.meetings.filter((meeting) => !seedMeetingIds.has(meeting.id)).slice(-5);

  if (!promotedTasks.length && !promotedMeetings.length) return null;

  return <section className="panel module-panel"><div className="section-heading"><div><span className="eyebrow">Promoted deal execution</span><h2>Tasks and meetings from agent imports</h2></div></div><div className="deal-grid"><Detail title="Promoted tasks" items={promotedTasks.map((task) => `${task.priority}: ${task.title} — ${task.nextAction}`)} /><Detail title="Promoted meetings" items={promotedMeetings.map((meeting) => `${meeting.title}: ${meeting.goal}`)} /></div></section>;
}

function PromotedIntentPanel({ commandCenterData }: { commandCenterData: NormalizedSalesData }) {
  const seedTriggerIds = new Set(seedSalesData.triggers.map((trigger) => trigger.id));
  const seedDraftIds = new Set(seedSalesData.emailDrafts.map((draft) => draft.id));
  const promotedTriggers = commandCenterData.triggers.filter((trigger) => !seedTriggerIds.has(trigger.id)).slice(-5);
  const promotedDrafts = commandCenterData.emailDrafts.filter((draft) => !seedDraftIds.has(draft.id)).slice(-5);

  if (!promotedTriggers.length && !promotedDrafts.length) return null;

  return <section className="panel module-panel"><div className="section-heading"><div><span className="eyebrow">Promoted intent follow-up</span><h2>Signals and drafts from agent imports</h2></div></div><div className="detail-grid"><Detail title="Promoted signals" items={promotedTriggers.map((trigger) => `${trigger.title}: ${trigger.nextAction}`)} /><Detail title="Promoted drafts" items={promotedDrafts.map((draft) => `${draft.subject}: ${draft.nextAction}`)} /></div></section>;
}

function buildPromotedRuns(commandCenterData: NormalizedSalesData) {
  const promotedCount =
    Math.max(0, commandCenterData.accounts.length - seedSalesData.accounts.length) +
    Math.max(0, commandCenterData.tasks.length - seedSalesData.tasks.length) +
    Math.max(0, commandCenterData.triggers.length - seedSalesData.triggers.length) +
    Math.max(0, commandCenterData.emailDrafts.length - seedSalesData.emailDrafts.length) +
    Math.max(0, commandCenterData.meetings.length - seedSalesData.meetings.length);

  if (!promotedCount) {
    return [];
  }

  return [
    {
      workflow: "Agent Inbox Promotion",
      date: "Jul 3, 2026",
      source: "Promoted agent artifacts",
      output: `${promotedCount} normalized command center records`,
      status: "Promoted",
    },
  ];
}
