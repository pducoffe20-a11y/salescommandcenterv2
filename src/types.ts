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

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export type AgentArtifactType =
  | "trigger"
  | "task"
  | "meeting"
  | "emailDraft"
  | "note"
  | "accountUpdate"
  | "priorityItem";

export type CommandCenterDestinationModel =
  | "triggers"
  | "tasks"
  | "meetings"
  | "emailDrafts"
  | "notes"
  | "accountUpdates"
  | "priorityItems";

export const agentArtifactDestinationModel = {
  trigger: "triggers",
  task: "tasks",
  meeting: "meetings",
  emailDraft: "emailDrafts",
  note: "notes",
  accountUpdate: "accountUpdates",
  priorityItem: "priorityItems",
} as const satisfies Record<AgentArtifactType, CommandCenterDestinationModel>;

export interface AgentOutputImport {
  id: string;
  agentId: string;
  artifactType: AgentArtifactType;
  accountId?: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  title: string;
  summary: string;
  source: string;
  confidence: number;
  createdAt: string;
  recommendedAction: string;
  rawPayload: JsonValue;
}

export interface AgentOutputArtifact extends AgentOutputImport {
  destinationModel: CommandCenterDestinationModel;
}

export interface TriggerAgentOutput extends AgentOutputArtifact {
  artifactType: "trigger";
  destinationModel: "triggers";
}

export interface TaskAgentOutput extends AgentOutputArtifact {
  artifactType: "task";
  destinationModel: "tasks";
}

export interface MeetingAgentOutput extends AgentOutputArtifact {
  artifactType: "meeting";
  destinationModel: "meetings";
}

export interface EmailDraftAgentOutput extends AgentOutputArtifact {
  artifactType: "emailDraft";
  destinationModel: "emailDrafts";
}

export interface NoteAgentOutput extends AgentOutputArtifact {
  artifactType: "note";
  destinationModel: "notes";
}

export interface AccountUpdateAgentOutput extends AgentOutputArtifact {
  artifactType: "accountUpdate";
  destinationModel: "accountUpdates";
}

export interface PriorityItemAgentOutput extends AgentOutputArtifact {
  artifactType: "priorityItem";
  destinationModel: "priorityItems";
}

export type CommandCenterAgentOutput =
  | TriggerAgentOutput
  | TaskAgentOutput
  | MeetingAgentOutput
  | EmailDraftAgentOutput
  | NoteAgentOutput
  | AccountUpdateAgentOutput
  | PriorityItemAgentOutput;

export type AgentOutputImportsByDestination = {
  [Destination in CommandCenterDestinationModel]: CommandCenterAgentOutput[];
};
export type AgentArtifactKind =
  | "Meeting prep"
  | "Follow-up"
  | "Pre-call brief"
  | "Voice review"
  | "Research note";

export type AgentArtifactStatus =
  | "Imported"
  | "Promoted"
  | "Archived"
  | "Rejected";

export interface AgentArtifact {
  id: string;
  kind: AgentArtifactKind;
  status: AgentArtifactStatus;
  title: string;
  accountId?: string;
  contactId?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  source?: string;
  metadata?: Record<string, JsonValue>;
  payload?: JsonValue;
}
