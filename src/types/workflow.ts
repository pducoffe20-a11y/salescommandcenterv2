export const workflowIds = [
  "prospecting",
  "prospects",
  "precall",
  "deals",
  "intent",
  "exports",
  "settings",
] as const;

export type WorkflowId = (typeof workflowIds)[number];
export type SourceState = "connected" | "not connected" | "mock only" | "needs setup" | "used in current run";
export type WorkStatus = "Work Now" | "Validate" | "Watch" | "Deprioritize";
export type ProspectStatus = "Work Now" | "Light Research" | "Suppress";

export interface WorkflowCardData { id: WorkflowId; name: string; purpose: string; inputs: string[]; outputs: string[]; status: string; accent: string; }
export interface SourceConnection { name: string; state: SourceState; note: string; }
export interface TerritoryAccount { account_id: string; account_name: string; rank: number; priority_tier: string; priority_score: number; icp_fit_score: number; why_now_score: number; evidence_quality_score: number; brightspace_angle: string; status: WorkStatus; verified_facts: string[]; workbook_inputs: string[]; assumptions: string[]; unknowns: string[]; research_gaps: string[]; likely_stakeholders: string[]; risks: string[]; disqualifiers: string[]; recommended_next_action: string; recommended_first_touch: string; suggested_channel: string; confidence_level: string; source_notes: string[]; }
export interface StrategyRecord { prospect_id: string; full_name: string; title: string; organization: string; email: string; category: string; status: ProspectStatus; score_total: number; scores: { fit: number; urgency: number; persona: number; evidence: number }; tenure_months: number | null; verified_facts: string[]; inferred_pains: string[]; unknowns: string[]; what_to_check_first: string; evidence_notes: string; matched_customer_story: string | null; recommended_actions: string[]; outreach_payload: { review_status: "needs_review"; subject_line: string; email_body: string; review_flags: string[]; fact_check_targets: string[]; suppression_reason: string; }; }
export interface DealReview { account: string; opportunity: string; route: string; judgment: string; confidence: string; momentum: number; risk: number; stakeholderCoverage: number; evidence: number; meddic: Array<{ name: string; status: string; strength: string; confirmed: string[]; missing: string; next: string; }>; signals: string[]; risks: string[]; stakeholders: Array<{ name: string; role: string; coverage: string; evidence: string; }>; nextMoves: Array<{ who: string; why: string; angle: string; proof: string; outcome: string; }>; gaps: string[]; }
export interface IntentAccount { name: string; evidenceStrength: string; repeatedActivity: string; urgencySignal: string; storyMatch: string | null; summary: string; rawEvidence: string[]; draft: string; }
