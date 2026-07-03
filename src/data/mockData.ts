import type {
  Account,
  Competitor,
  Contact,
  EmailDraft,
  Meeting,
  OpportunityNote,
  PriorityItem,
  Task,
  TimelineEvent,
  Trigger,
} from "../types";

export const accounts: Account[] = [
  {
    id: "northstar",
    name: "Northstar State University",
    segment: "Enterprise",
    region: "Midwest",
    arrPotential: 640000,
    stage: "Discovery booked",
    owner: "Pat Ducoffe",
    fitScore: 91,
    timingScore: 88,
    momentumScore: 86,
    riskScore: 28,
    relationshipStatus: "Active",
    snapshot:
      "Large public university running a mixed LMS stack across main campus and continuing education. They want fewer handoffs between advising, course design, and faculty support.",
    knownPain: [
      "Faculty adoption varies by college, especially in nursing and business.",
      "The provost's team wants better early alerts for students at risk.",
      "Continuing education needs cleaner reporting for non-credit programs.",
    ],
    researchGaps: [
      "Current renewal window for their assessment add-on.",
      "Who owns budget for student success analytics.",
      "Whether the CIO is measuring LMS support ticket volume.",
    ],
    recommendedAction:
      "Send Mira a two-part agenda and ask which student success metric should anchor the call.",
    whyItMatters:
      "The provost's office has an active retention push, and the LMS conversation is tied to next year's student success budget.",
    softCta: "Offer a 25-minute working session around one retention workflow.",
    valueAngles: [
      "Show how Brightspace nudges can support faculty before a student disappears.",
      "Connect analytics to the provost's retention language instead of platform features.",
      "Keep the first ask small: one course pathway, one risk signal, one owner.",
    ],
  },
  {
    id: "summit",
    name: "Summit Career College",
    segment: "Growth",
    region: "Southeast",
    arrPotential: 210000,
    stage: "Proposal review",
    owner: "Pat Ducoffe",
    fitScore: 84,
    timingScore: 74,
    momentumScore: 71,
    riskScore: 42,
    relationshipStatus: "Warm",
    snapshot:
      "Career college expanding hybrid healthcare programs. Their academic team likes Brightspace, but finance is asking for clearer proof that the migration effort is worth it.",
    knownPain: [
      "Clinical instructors need easier mobile grading during rotations.",
      "Student services wants alerts when attendance and grade risk overlap.",
      "Finance is worried about launch effort across three campuses.",
    ],
    researchGaps: [
      "Which programs are moving first.",
      "How they measure current instructor support costs.",
      "Whether their SIS team has migration capacity in Q4.",
    ],
    recommendedAction:
      "Send a short migration risk note that names the first three decisions they need to make.",
    whyItMatters:
      "Finance is not blocking the deal yet, but they need to see the lift before they will support the timeline.",
    softCta: "Ask for a 15-minute finance readout with the academic sponsor present.",
    valueAngles: [
      "Frame the move around fewer manual touchpoints for clinical instructors.",
      "Give finance a plain migration map instead of a product tour.",
      "Use peer examples from healthcare programs with similar campus models.",
    ],
  },
  {
    id: "evergreen",
    name: "Evergreen Online Academy",
    segment: "Strategic",
    region: "West",
    arrPotential: 480000,
    stage: "Expansion signal",
    owner: "Pat Ducoffe",
    fitScore: 79,
    timingScore: 92,
    momentumScore: 83,
    riskScore: 35,
    relationshipStatus: "Quiet",
    snapshot:
      "Virtual K-12 network adding CTE pathways and looking for better parent-facing visibility. They have not replied in 18 days, but a new VP of Programs was announced this week.",
    knownPain: [
      "Parent communication is scattered across course shells and email.",
      "CTE pathway reporting is manual and slow.",
      "Teachers need reusable course templates across districts.",
    ],
    researchGaps: [
      "New VP's charter for CTE launch.",
      "Whether districts are asking for parent progress dashboards.",
      "Timing for the fall pathway rollout.",
    ],
    recommendedAction:
      "Send the new VP a concise note tied to the CTE announcement and ask who owns parent visibility.",
    whyItMatters:
      "A new executive sponsor can reopen the conversation before the fall pathway decisions harden.",
    softCta: "Suggest a quick fit check rather than a full demo.",
    valueAngles: [
      "Tie the message to CTE launch risk, not a general LMS pitch.",
      "Offer a simple parent visibility path for one pilot district.",
      "Use the new role announcement as a reason to be useful now.",
    ],
  },
  {
    id: "prairie",
    name: "Prairie Technical Institute",
    segment: "Enterprise",
    region: "Central",
    arrPotential: 530000,
    stage: "Renewal risk",
    owner: "Pat Ducoffe",
    fitScore: 87,
    timingScore: 69,
    momentumScore: 48,
    riskScore: 78,
    relationshipStatus: "At Risk",
    snapshot:
      "Long-time Brightspace customer with a new CIO reviewing vendor spend. Academic affairs is happy, but IT has raised support ticket concerns after a rough term start.",
    knownPain: [
      "LMS support ticket volume spiked during the first two weeks of term.",
      "IT wants clearer ownership for integrations.",
      "Academic affairs does not want a platform disruption.",
    ],
    researchGaps: [
      "Which support issues were product issues versus internal process.",
      "CIO's review deadline.",
      "Whether procurement is already comparing alternatives.",
    ],
    recommendedAction:
      "Call Jordan before sending the renewal deck and ask which issue would make the CIO feel heard.",
    whyItMatters:
      "The account is not unhappy enough to leave, but a quiet IT review can turn into a late-stage problem.",
    softCta: "Offer an issue review with support and the academic sponsor.",
    valueAngles: [
      "Separate term-start support pain from platform value.",
      "Protect the academic champion by bringing IT a concrete response plan.",
      "Make the CIO conversation about risk reduction, not renewal pressure.",
    ],
  },
  {
    id: "lakeside",
    name: "Lakeside Community College",
    segment: "Growth",
    region: "Northeast",
    arrPotential: 185000,
    stage: "Nurture",
    owner: "Pat Ducoffe",
    fitScore: 73,
    timingScore: 61,
    momentumScore: 58,
    riskScore: 31,
    relationshipStatus: "Warm",
    snapshot:
      "Community college exploring student success tools after a retention task force recommended earlier intervention in gateway courses.",
    knownPain: [
      "Gateway course risk is identified too late in the term.",
      "Advisors are missing context from course activity.",
      "Faculty want fewer manual reports.",
    ],
    researchGaps: [
      "Task force members and executive sponsor.",
      "Which gateway courses are in scope.",
      "Current advising workflow after a risk flag.",
    ],
    recommendedAction:
      "Share a one-page gateway course workflow and ask if it matches the task force's first use case.",
    whyItMatters:
      "They are still shaping the project, so a useful workflow can influence how the work is defined.",
    softCta: "Ask for the task force's top two questions before proposing a meeting.",
    valueAngles: [
      "Make the problem visible in one course, not across the whole institution.",
      "Bring advisors and faculty into the same workflow.",
      "Position Brightspace as a practical early alert partner.",
    ],
  },
];

export const contacts: Contact[] = [
  {
    id: "mira",
    accountId: "northstar",
    name: "Mira Chen",
    role: "Associate Provost, Student Success",
    influence: "Economic Buyer",
    relationship: "Active",
    lastTouch: "Yesterday",
    angle:
      "Cares about retention gains that faculty can actually support during the term.",
  },
  {
    id: "daniel",
    accountId: "northstar",
    name: "Daniel Ortiz",
    role: "Director of Learning Technology",
    influence: "Champion",
    relationship: "Warm",
    lastTouch: "4 days ago",
    angle:
      "Wants fewer disconnected tools and clearer support paths for course teams.",
  },
  {
    id: "rachel",
    accountId: "summit",
    name: "Rachel Lowe",
    role: "VP Academic Operations",
    influence: "Champion",
    relationship: "Active",
    lastTouch: "Today",
    angle:
      "Needs the healthcare launch to feel controlled for instructors and clinical partners.",
  },
  {
    id: "omar",
    accountId: "summit",
    name: "Omar Patel",
    role: "CFO",
    influence: "Economic Buyer",
    relationship: "Quiet",
    lastTouch: "12 days ago",
    angle:
      "Wants migration effort, timeline, and support cost spelled out before approving spend.",
  },
  {
    id: "tessa",
    accountId: "evergreen",
    name: "Tessa Morgan",
    role: "VP Programs",
    influence: "Economic Buyer",
    relationship: "Quiet",
    lastTouch: "No contact yet",
    angle:
      "New leader likely sorting CTE launch risk, parent visibility, and district reporting.",
  },
  {
    id: "marcus",
    accountId: "evergreen",
    name: "Marcus Hill",
    role: "Director of Virtual Instruction",
    influence: "Evaluator",
    relationship: "Warm",
    lastTouch: "18 days ago",
    angle:
      "Focused on repeatable course design and teacher workload across districts.",
  },
  {
    id: "jordan",
    accountId: "prairie",
    name: "Jordan Fields",
    role: "CIO",
    influence: "Economic Buyer",
    relationship: "At Risk",
    lastTouch: "21 days ago",
    angle:
      "Needs a clear answer on ticket volume, integrations, and who will own the fix.",
  },
  {
    id: "nelly",
    accountId: "prairie",
    name: "Nelly Brooks",
    role: "Dean of Academic Affairs",
    influence: "Champion",
    relationship: "Active",
    lastTouch: "3 days ago",
    angle:
      "Wants to protect faculty stability while IT reviews platform spend.",
  },
  {
    id: "angela",
    accountId: "lakeside",
    name: "Angela Reed",
    role: "Dean of Student Success",
    influence: "Champion",
    relationship: "Warm",
    lastTouch: "6 days ago",
    angle:
      "Needs practical help turning retention task force findings into action.",
  },
];

export const meetings: Meeting[] = [
  {
    id: "m-1",
    accountId: "northstar",
    contactId: "mira",
    title: "Retention workflow discovery",
    time: "Today, 11:30 AM",
    context:
      "Mira asked for examples of how faculty see risk before the fourth week.",
    prepNeed:
      "Bring two questions about faculty action and one simple example of a risk signal moving to advising.",
    goal: "Leave with one pilot workflow and one executive success metric.",
    risk: "Too much product detail too early could make the meeting feel like a demo.",
  },
  {
    id: "m-2",
    accountId: "summit",
    contactId: "rachel",
    title: "Healthcare migration checkpoint",
    time: "Today, 2:00 PM",
    context:
      "Rachel wants a grounded path for the first healthcare cohort before finance review.",
    prepNeed:
      "Name the migration decisions, owner, and order. Keep it focused on launch confidence.",
    goal: "Agree on the finance readout and which decision Omar needs first.",
    risk: "Rachel may overpromise timeline before SIS capacity is clear.",
  },
  {
    id: "m-3",
    accountId: "prairie",
    contactId: "nelly",
    title: "Renewal risk backchannel",
    time: "Tomorrow, 9:00 AM",
    context:
      "Nelly can share how serious the CIO review is and what would calm IT down.",
    prepNeed:
      "Ask what Jordan has heard, what support issues are real, and what academic affairs cannot afford to disrupt.",
    goal: "Build a response plan before the renewal deck lands.",
    risk: "Pushing renewal terms before listening would burn trust.",
  },
];

export const tasks: Task[] = [
  {
    id: "t-1",
    accountId: "prairie",
    contactId: "jordan",
    title: "Call Jordan before sending renewal deck",
    due: "Overdue by 2 days",
    priority: "High",
    status: "Overdue",
    whyItMatters:
      "The CIO review is quiet and could shape the renewal before procurement is visible.",
    nextAction:
      "Ask which support issue would make the renewal conversation feel fair.",
  },
  {
    id: "t-2",
    accountId: "evergreen",
    contactId: "tessa",
    title: "Send CTE launch note to new VP",
    due: "Due today",
    priority: "High",
    status: "Due Today",
    whyItMatters:
      "The announcement gives you a timely reason to be useful without forcing a demo.",
    nextAction:
      "Reference the CTE rollout and ask who owns parent visibility for the pilot.",
  },
  {
    id: "t-3",
    accountId: "summit",
    contactId: "omar",
    title: "Prepare finance readout",
    due: "Due today",
    priority: "Medium",
    status: "Due Today",
    whyItMatters:
      "Finance needs effort and timeline spelled out before the proposal can move.",
    nextAction:
      "Send a three-decision migration note and invite Omar to a short readout.",
  },
  {
    id: "t-4",
    accountId: "lakeside",
    contactId: "angela",
    title: "Share gateway course workflow",
    due: "Friday",
    priority: "Medium",
    status: "This Week",
    whyItMatters:
      "Their task force is still defining the work, which makes useful guidance more valuable than a pitch.",
    nextAction:
      "Ask if the workflow matches the first retention use case they want to test.",
  },
];

export const triggers: Trigger[] = [
  {
    id: "tr-1",
    accountId: "evergreen",
    title: "New VP Programs announced",
    source: "Website update",
    detectedAt: "42 minutes ago",
    whyItMatters:
      "A new executive sponsor may reset priorities around the CTE launch.",
    nextAction:
      "Send a note that connects CTE launch risk with parent visibility.",
  },
  {
    id: "tr-2",
    accountId: "northstar",
    title: "Provost shares retention initiative",
    source: "LinkedIn",
    detectedAt: "2 hours ago",
    whyItMatters:
      "The public language gives you a natural anchor for Mira's discovery call.",
    nextAction:
      "Open with the retention goal and ask which behavior changes first.",
  },
  {
    id: "tr-3",
    accountId: "prairie",
    title: "IT spend review added to board agenda",
    source: "Board packet",
    detectedAt: "Yesterday",
    whyItMatters:
      "The renewal risk may be moving from informal concern to formal review.",
    nextAction:
      "Call the CIO with a support issue review before the board meeting.",
  },
];

export const emailDrafts: EmailDraft[] = [
  {
    id: "e-1",
    accountId: "evergreen",
    contactId: "tessa",
    subject: "CTE launch and parent visibility",
    body:
      "Tessa, congrats on the new role. I saw Evergreen is expanding CTE pathways, and I wondered if parent visibility is already on your launch list. We have helped similar virtual programs make one pilot pathway easier to track without asking teachers to do extra reporting. Worth a quick fit check next week?",
    whyItMatters:
      "The note is tied to a real change at the account, so it feels timely instead of random.",
    nextAction:
      "Send after adding one sentence that references the public announcement.",
  },
  {
    id: "e-2",
    accountId: "summit",
    contactId: "omar",
    subject: "Three decisions before migration",
    body:
      "Omar, Rachel mentioned you wanted a clearer view of the lift before approving the healthcare rollout. I pulled the migration into three decisions: first programs, SIS owner, and instructor support plan. Would it be useful to walk through those for 15 minutes with Rachel?",
    whyItMatters:
      "Finance needs clarity on effort, not a longer feature walkthrough.",
    nextAction:
      "Send before the 2 PM checkpoint so Rachel can reinforce it live.",
  },
];

export const opportunityNotes: OpportunityNote[] = [
  {
    id: "n-1",
    accountId: "northstar",
    author: "Pat",
    date: "Jul 2",
    note:
      "Mira reacted strongly to faculty adoption examples. She asked whether nudges can show up early enough for advisors to act before week four.",
  },
  {
    id: "n-2",
    accountId: "summit",
    author: "Pat",
    date: "Jun 30",
    note:
      "Rachel is sold on the academic story. Omar is not against it, but he needs the migration effort put in plain language.",
  },
  {
    id: "n-3",
    accountId: "prairie",
    author: "CSM",
    date: "Jul 1",
    note:
      "Term-start tickets were mostly integration ownership and training questions. Product issues were limited but IT felt exposed.",
  },
];

export const competitors: Competitor[] = [
  {
    id: "c-1",
    accountId: "northstar",
    name: "Canvas",
    footprint: "Used by two peer institutions in the state system.",
    wedge:
      "They may point to peer familiarity; counter with retention workflows and faculty support depth.",
  },
  {
    id: "c-2",
    accountId: "summit",
    name: "Moodle partner",
    footprint: "Low-cost alternative for smaller healthcare programs.",
    wedge:
      "They will compete on cost; keep the conversation around clinical instructor time and launch risk.",
  },
  {
    id: "c-3",
    accountId: "prairie",
    name: "Blackboard Ultra",
    footprint: "Known to the CIO from prior institution.",
    wedge:
      "They may frame switching as clean-up; respond with a practical support plan and academic continuity.",
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: "tl-1",
    accountId: "northstar",
    date: "Today",
    title: "Discovery call",
    detail: "Mira wants faculty action examples tied to retention.",
    type: "Meeting",
  },
  {
    id: "tl-2",
    accountId: "northstar",
    date: "Yesterday",
    title: "Retention initiative posted",
    detail: "Provost announced a first-year persistence push.",
    type: "Trigger",
  },
  {
    id: "tl-3",
    accountId: "summit",
    date: "Today",
    title: "Proposal checkpoint",
    detail: "Rachel asked for migration decisions before finance review.",
    type: "Meeting",
  },
  {
    id: "tl-4",
    accountId: "evergreen",
    date: "Today",
    title: "Draft ready",
    detail: "CTE launch note prepared for Tessa.",
    type: "Email",
  },
  {
    id: "tl-5",
    accountId: "prairie",
    date: "Yesterday",
    title: "Board agenda signal",
    detail: "IT spend review appears in board materials.",
    type: "Trigger",
  },
  {
    id: "tl-6",
    accountId: "lakeside",
    date: "Jun 28",
    title: "Task force note",
    detail: "Angela asked for gateway course intervention examples.",
    type: "Call",
  },
];

export const priorityItems: PriorityItem[] = [
  {
    id: "p-1",
    signalType: "Risk",
    accountId: "prairie",
    contactId: "jordan",
    title: "Quiet CIO renewal review",
    urgency: 96,
    whyItMatters:
      "IT concerns are ahead of procurement. A listening call now can prevent a renewal surprise.",
    recommendedAction:
      "Call Jordan and ask which support issue would make the conversation feel fair.",
    softCta: "Offer a focused support review with academic affairs included.",
  },
  {
    id: "p-2",
    signalType: "Meeting",
    accountId: "northstar",
    contactId: "mira",
    title: "Prep retention discovery",
    urgency: 91,
    whyItMatters:
      "Mira has a live student success goal and needs the call grounded in faculty action.",
    recommendedAction:
      "Anchor the meeting on one risk signal, one owner, and one student outcome.",
    softCta: "Ask which metric she wants to improve first.",
  },
  {
    id: "p-3",
    signalType: "Draft",
    accountId: "evergreen",
    contactId: "tessa",
    title: "Send new VP note",
    urgency: 84,
    whyItMatters:
      "The role announcement creates a useful reason to reach out before CTE decisions settle.",
    recommendedAction:
      "Send the CTE note with one question about parent visibility.",
    softCta: "Suggest a quick fit check next week.",
  },
  {
    id: "p-4",
    signalType: "Follow-up",
    accountId: "summit",
    contactId: "omar",
    title: "Make finance review easier",
    urgency: 79,
    whyItMatters:
      "Omar needs the migration lift explained before the proposal can move.",
    recommendedAction:
      "Send the three-decision migration note before Rachel's checkpoint.",
    softCta: "Offer a 15-minute readout with Rachel.",
  },
];
