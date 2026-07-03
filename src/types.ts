export type AccountTier = "Enterprise" | "Strategic" | "Growth";

export type RelationshipStatus = "Warm" | "Active" | "Quiet" | "At Risk";

export type SignalType =
  | "Meeting"
  | "Follow-up"
  | "Trigger"
  | "Draft"
  | "Risk"
  | "Momentum";

export interface Account {
  id: string;
  name: string;
  segment: AccountTier;
  region: string;
  arrPotential: number;
  stage: string;
  owner: string;
  fitScore: number;
  timingScore: number;
  momentumScore: number;
  riskScore: number;
  relationshipStatus: RelationshipStatus;
  snapshot: string;
  knownPain: string[];
  researchGaps: string[];
  recommendedAction: string;
  whyItMatters: string;
  softCta: string;
  valueAngles: string[];
}

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  role: string;
  influence: "Economic Buyer" | "Champion" | "Evaluator" | "User" | "Blocker";
  relationship: RelationshipStatus;
  lastTouch: string;
  angle: string;
}

export interface Meeting {
  id: string;
  accountId: string;
  contactId: string;
  title: string;
  time: string;
  context: string;
  prepNeed: string;
  goal: string;
  risk: string;
}

export interface Task {
  id: string;
  accountId: string;
  contactId?: string;
  title: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: "Overdue" | "Due Today" | "This Week";
  whyItMatters: string;
  nextAction: string;
}

export interface Trigger {
  id: string;
  accountId: string;
  title: string;
  source: string;
  detectedAt: string;
  whyItMatters: string;
  nextAction: string;
}

export interface EmailDraft {
  id: string;
  accountId: string;
  contactId: string;
  subject: string;
  body: string;
  whyItMatters: string;
  nextAction: string;
}

export interface OpportunityNote {
  id: string;
  accountId: string;
  note: string;
  author: string;
  date: string;
}

export interface Competitor {
  id: string;
  accountId: string;
  name: string;
  footprint: string;
  wedge: string;
}

export interface TimelineEvent {
  id: string;
  accountId: string;
  date: string;
  title: string;
  detail: string;
  type: "Call" | "Email" | "Meeting" | "Trigger" | "Task";
}

export interface PriorityItem {
  id: string;
  signalType: SignalType;
  accountId: string;
  contactId?: string;
  title: string;
  urgency: number;
  whyItMatters: string;
  recommendedAction: string;
  softCta: string;
}

export interface ProspectRow {
  account: string;
  contact: string;
  role: string;
  segment: string;
  region: string;
  signal: string;
  notes: string;
}

export interface ScoredProspect extends ProspectRow {
  score: number;
  fit: "Strong" | "Promising" | "Needs Research";
  outreachAngle: string;
  missingResearch: string[];
  actionBoard: string[];
}
