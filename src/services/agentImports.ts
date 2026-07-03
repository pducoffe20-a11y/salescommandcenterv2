import {
  accounts as seedAccounts,
  competitors as seedCompetitors,
  contacts as seedContacts,
  emailDrafts as seedEmailDrafts,
  meetings as seedMeetings,
  opportunityNotes as seedOpportunityNotes,
  priorityItems as seedPriorityItems,
  tasks as seedTasks,
  timelineEvents as seedTimelineEvents,
  triggers as seedTriggers,
} from "../data/mockData";
import type {
  Account,
  AccountTier,
  Competitor,
  Contact,
  EmailDraft,
  Meeting,
  OpportunityNote,
  PriorityItem,
  RelationshipStatus,
  SignalType,
  Task,
  TimelineEvent,
  Trigger,
} from "../types";

export interface AgentAccountSignal {
  id?: string;
  accountId: string;
  accountName: string;
  segment?: AccountTier;
  region?: string;
  arrPotential?: number;
  stage?: string;
  owner?: string;
  fitScore?: number;
  timingScore?: number;
  momentumScore?: number;
  riskScore?: number;
  relationshipStatus?: RelationshipStatus;
  snapshot?: string;
  knownPain?: string[];
  researchGaps?: string[];
  recommendedAction?: string;
  whyItMatters?: string;
  softCta?: string;
  valueAngles?: string[];
  contacts?: AgentContactSignal[];
  triggers?: AgentTriggerSignal[];
  actionItems?: AgentActionItem[];
  emailDrafts?: AgentEmailDraft[];
}

export interface AgentContactSignal {
  id?: string;
  accountId?: string;
  name: string;
  role?: string;
  influence?: Contact["influence"];
  relationship?: RelationshipStatus;
  lastTouch?: string;
  angle?: string;
}

export interface AgentTriggerSignal {
  id?: string;
  accountId?: string;
  title: string;
  source?: string;
  detectedAt?: string;
  whyItMatters?: string;
  nextAction?: string;
}

export interface AgentMeetingBrief {
  id?: string;
  accountId: string;
  contactId?: string;
  contactName?: string;
  title: string;
  time?: string;
  context?: string;
  prepNeed?: string;
  goal?: string;
  risk?: string;
}

export interface AgentActionItem {
  id?: string;
  accountId: string;
  contactId?: string;
  contactName?: string;
  title: string;
  due?: string;
  priority?: Task["priority"];
  status?: Task["status"];
  signalType?: SignalType;
  urgency?: number;
  whyItMatters?: string;
  nextAction?: string;
  recommendedAction?: string;
  softCta?: string;
}

export interface AgentEmailDraft {
  id?: string;
  accountId: string;
  contactId?: string;
  contactName?: string;
  subject: string;
  body: string;
  whyItMatters?: string;
  nextAction?: string;
}

export interface AgentArtifact {
  accounts?: AgentAccountSignal[];
  contacts?: AgentContactSignal[];
  triggers?: AgentTriggerSignal[];
  meetings?: AgentMeetingBrief[];
  actionItems?: AgentActionItem[];
  emailDrafts?: AgentEmailDraft[];
}

export interface NormalizedSalesData {
  accounts: Account[];
  contacts: Contact[];
  meetings: Meeting[];
  tasks: Task[];
  triggers: Trigger[];
  emailDrafts: EmailDraft[];
  priorityItems: PriorityItem[];
  opportunityNotes: OpportunityNote[];
  competitors: Competitor[];
  timelineEvents: TimelineEvent[];
}

const defaultAccount: Omit<Account, "id" | "name"> = {
  segment: "Growth",
  region: "Unknown",
  arrPotential: 0,
  stage: "Imported signal",
  owner: "Unassigned",
  fitScore: 50,
  timingScore: 50,
  momentumScore: 50,
  riskScore: 25,
  relationshipStatus: "Warm",
  snapshot: "Imported account signal pending review.",
  knownPain: [],
  researchGaps: [],
  recommendedAction: "Review imported account context and choose the next best action.",
  whyItMatters: "Agent-generated context may reveal a timely account opportunity.",
  softCta: "Ask for a short fit check.",
  valueAngles: [],
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "imported";

const uniq = <T extends { id: string }>(items: T[]) =>
  Array.from(new Map(items.map((item) => [item.id, item])).values());

const resolveContactId = (
  artifact: { contactId?: string; contactName?: string; accountId: string },
  contacts: Contact[],
) =>
  artifact.contactId ??
  contacts.find(
    (contact) =>
      contact.accountId === artifact.accountId &&
      contact.name.toLowerCase() === artifact.contactName?.toLowerCase(),
  )?.id ??
  `${artifact.accountId}-contact`;

export function normalizeAccountSignal(signal: AgentAccountSignal): Account {
  return {
    ...defaultAccount,
    id: signal.id ?? signal.accountId,
    name: signal.accountName,
    segment: signal.segment ?? defaultAccount.segment,
    region: signal.region ?? defaultAccount.region,
    arrPotential: signal.arrPotential ?? defaultAccount.arrPotential,
    stage: signal.stage ?? defaultAccount.stage,
    owner: signal.owner ?? defaultAccount.owner,
    fitScore: signal.fitScore ?? defaultAccount.fitScore,
    timingScore: signal.timingScore ?? defaultAccount.timingScore,
    momentumScore: signal.momentumScore ?? defaultAccount.momentumScore,
    riskScore: signal.riskScore ?? defaultAccount.riskScore,
    relationshipStatus:
      signal.relationshipStatus ?? defaultAccount.relationshipStatus,
    snapshot: signal.snapshot ?? defaultAccount.snapshot,
    knownPain: signal.knownPain ?? defaultAccount.knownPain,
    researchGaps: signal.researchGaps ?? defaultAccount.researchGaps,
    recommendedAction:
      signal.recommendedAction ?? defaultAccount.recommendedAction,
    whyItMatters: signal.whyItMatters ?? defaultAccount.whyItMatters,
    softCta: signal.softCta ?? defaultAccount.softCta,
    valueAngles: signal.valueAngles ?? defaultAccount.valueAngles,
  };
}

export function normalizeContactSignal(
  contact: AgentContactSignal,
  accountId: string,
): Contact {
  return {
    id: contact.id ?? `${accountId}-${slugify(contact.name)}`,
    accountId: contact.accountId ?? accountId,
    name: contact.name,
    role: contact.role ?? "Imported stakeholder",
    influence: contact.influence ?? "Evaluator",
    relationship: contact.relationship ?? "Warm",
    lastTouch: contact.lastTouch ?? "Imported",
    angle: contact.angle ?? "Review imported context before outreach.",
  };
}

export function normalizeTriggerSignal(
  trigger: AgentTriggerSignal,
  accountId: string,
): Trigger {
  return {
    id: trigger.id ?? `${accountId}-trigger-${slugify(trigger.title)}`,
    accountId: trigger.accountId ?? accountId,
    title: trigger.title,
    source: trigger.source ?? "Agent import",
    detectedAt: trigger.detectedAt ?? "Recently",
    whyItMatters:
      trigger.whyItMatters ?? "This imported signal may change account timing.",
    nextAction: trigger.nextAction ?? "Validate the signal and pick a next step.",
  };
}

export function normalizeMeetingBrief(
  brief: AgentMeetingBrief,
  contacts: Contact[] = [],
): Meeting {
  return {
    id: brief.id ?? `${brief.accountId}-meeting-${slugify(brief.title)}`,
    accountId: brief.accountId,
    contactId: resolveContactId(brief, contacts),
    title: brief.title,
    time: brief.time ?? "TBD",
    context: brief.context ?? "Imported meeting brief pending review.",
    prepNeed: brief.prepNeed ?? "Confirm agenda, stakeholders, and desired outcome.",
    goal: brief.goal ?? "Leave with a clear next step.",
    risk: brief.risk ?? "Imported context has not yet been validated.",
  };
}

export function normalizeActionItem(
  item: AgentActionItem,
  contacts: Contact[] = [],
): { task: Task; priorityItem: PriorityItem } {
  const contactId = resolveContactId(item, contacts);
  const recommendedAction = item.recommendedAction ?? item.nextAction ?? item.title;

  return {
    task: {
      id: item.id ?? `${item.accountId}-task-${slugify(item.title)}`,
      accountId: item.accountId,
      contactId,
      title: item.title,
      due: item.due ?? "This week",
      priority: item.priority ?? "Medium",
      status: item.status ?? "This Week",
      whyItMatters:
        item.whyItMatters ?? "This imported action may advance the account.",
      nextAction: item.nextAction ?? recommendedAction,
    },
    priorityItem: {
      id: `priority-${item.id ?? `${item.accountId}-${slugify(item.title)}`}`,
      signalType: item.signalType ?? "Follow-up",
      accountId: item.accountId,
      contactId,
      title: item.title,
      urgency: item.urgency ?? (item.priority === "High" ? 85 : 60),
      whyItMatters:
        item.whyItMatters ?? "This imported action may advance the account.",
      recommendedAction,
      softCta: item.softCta ?? "Ask for a short next-step conversation.",
    },
  };
}

export function normalizeEmailDraft(
  draft: AgentEmailDraft,
  contacts: Contact[] = [],
): EmailDraft {
  return {
    id: draft.id ?? `${draft.accountId}-email-${slugify(draft.subject)}`,
    accountId: draft.accountId,
    contactId: resolveContactId(draft, contacts),
    subject: draft.subject,
    body: draft.body,
    whyItMatters:
      draft.whyItMatters ?? "This imported draft is tied to recent account context.",
    nextAction: draft.nextAction ?? "Review, personalize, and send.",
  };
}

export function normalizeAgentArtifacts(
  artifact: AgentArtifact,
  baseData: NormalizedSalesData = seedSalesData,
): NormalizedSalesData {
  const nestedContacts = artifact.accounts?.flatMap((account) =>
    (account.contacts ?? []).map((contact) =>
      normalizeContactSignal(contact, account.accountId),
    ),
  ) ?? [];
  const importedAccounts = artifact.accounts?.map(normalizeAccountSignal) ?? [];
  const importedContacts = [
    ...nestedContacts,
    ...(artifact.contacts?.map((contact) =>
      normalizeContactSignal(contact, contact.accountId ?? "imported"),
    ) ?? []),
  ];
  const contacts = uniq([...baseData.contacts, ...importedContacts]);

  const nestedTriggers = artifact.accounts?.flatMap((account) =>
    (account.triggers ?? []).map((trigger) =>
      normalizeTriggerSignal(trigger, account.accountId),
    ),
  ) ?? [];
  const importedTriggers = [
    ...nestedTriggers,
    ...(artifact.triggers?.map((trigger) =>
      normalizeTriggerSignal(trigger, trigger.accountId ?? "imported"),
    ) ?? []),
  ];

  const nestedActionItems = artifact.accounts?.flatMap(
    (account) => account.actionItems ?? [],
  ) ?? [];
  const actionPairs = [...nestedActionItems, ...(artifact.actionItems ?? [])].map(
    (item) => normalizeActionItem(item, contacts),
  );

  const nestedEmailDrafts = artifact.accounts?.flatMap(
    (account) => account.emailDrafts ?? [],
  ) ?? [];

  return {
    ...baseData,
    accounts: uniq([...baseData.accounts, ...importedAccounts]),
    contacts,
    meetings: uniq([
      ...baseData.meetings,
      ...(artifact.meetings?.map((brief) =>
        normalizeMeetingBrief(brief, contacts),
      ) ?? []),
    ]),
    tasks: uniq([...baseData.tasks, ...actionPairs.map(({ task }) => task)]),
    triggers: uniq([...baseData.triggers, ...importedTriggers]),
    emailDrafts: uniq([
      ...baseData.emailDrafts,
      ...[...nestedEmailDrafts, ...(artifact.emailDrafts ?? [])].map((draft) =>
        normalizeEmailDraft(draft, contacts),
      ),
    ]),
    priorityItems: uniq([
      ...baseData.priorityItems,
      ...actionPairs.map(({ priorityItem }) => priorityItem),
    ]).sort((a, b) => b.urgency - a.urgency),
  };
}

export const seedSalesData: NormalizedSalesData = {
  accounts: seedAccounts,
  contacts: seedContacts,
  meetings: seedMeetings,
  tasks: seedTasks,
  triggers: seedTriggers,
  emailDrafts: seedEmailDrafts,
  priorityItems: seedPriorityItems,
  opportunityNotes: seedOpportunityNotes,
  competitors: seedCompetitors,
  timelineEvents: seedTimelineEvents,
};

export const salesData = normalizeAgentArtifacts({}, seedSalesData);
