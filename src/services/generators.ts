import type {
  Account,
  Contact,
  ProspectRow,
  ScoredProspect,
} from "../types";

const bannedLanguage = [
  "leverage",
  "robust",
  "seamless",
  "best-in-class",
  "holistic",
  "scalable solutions",
  "just checking in",
  "hope this finds you well",
  "touch base",
  "circle back",
  "synergy",
];

const today = new Date("2026-07-03T12:00:00");

export interface MeetingPrepInput {
  account: string;
  contact: string;
  context: string;
  goals: string;
  risks: string;
}

export interface MeetingPrepBrief {
  headline: string;
  accountSnapshot: string;
  contactAngle: string;
  valueAngles: string[];
  discoveryQuestions: string[];
  objections: string[];
  opener: string;
  softNextStep: string;
  followUpDraft: string;
}

export interface FollowUpInput {
  account: string;
  contact: string;
  meetingOutcome: string;
  promisedItem: string;
  nextStep: string;
}

export interface FollowUpOutput {
  email: string;
  crmNote: string;
  nextTask: string;
  nextFollowUpDate: string;
}

export interface VoiceReviewResult {
  flags: string[];
  rewrite: string;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getAccountByName(accounts: Account[], accountName: string) {
  const normalized = accountName.toLowerCase().trim();
  return accounts.find((account) => account.name.toLowerCase() === normalized);
}

export function generateMeetingPrep(
  input: MeetingPrepInput,
  account?: Account,
  contact?: Contact,
): MeetingPrepBrief {
  const accountName = input.account || account?.name || "the account";
  const contactName = input.contact || contact?.name || "the buyer";
  const snapshot =
    account?.snapshot ||
    `${accountName} needs a practical conversation tied to the change they are trying to make, not a broad platform tour.`;
  const primaryPain =
    account?.knownPain[0] ||
    "They need help turning interest into a clear next step with an owner.";
  const goal =
    input.goals ||
    "Agree on one business problem, one buyer owner, and one follow-up step.";
  const risk =
    input.risks ||
    "The meeting may drift into general product talk before the buyer names the real problem.";

  return {
    headline: `${accountName}: prep for a useful conversation with ${contactName}`,
    accountSnapshot: snapshot,
    contactAngle:
      contact?.angle ||
      `${contactName} likely needs the conversation to respect their time and connect to a visible priority.`,
    valueAngles: account?.valueAngles.slice(0, 3) || [
      `Tie Brightspace to ${primaryPain.toLowerCase()}`,
      "Make the first step small enough that the buyer can say yes.",
      "Show what changes for the learner, teacher, or administrator in plain terms.",
    ],
    discoveryQuestions: [
      `What changed recently that made this worth time now?`,
      `If this work goes well, what gets easier for your team in the next term?`,
      `Who else will care about this decision before it moves forward?`,
      `What would make ${contactName.split(" ")[0]} hesitate after the call?`,
    ],
    objections: [
      `If timing feels early, ask what would need to be true for it to be worth revisiting.`,
      `If effort is the concern, narrow the conversation to the first workflow and the first owner.`,
      `If budget comes up, ask which risk is most expensive to leave alone.`,
    ],
    opener: `I saw the context around ${input.context || primaryPain}. I thought we could keep this simple: understand what you need to improve, see where Brightspace may help, and decide whether there is a small next step worth taking.`,
    softNextStep:
      account?.softCta ||
      `If the fit is there, suggest a short working session around one workflow instead of a broad demo.`,
    followUpDraft: `${contactName.split(" ")[0]}, thanks for the time today. The clearest thread I heard was ${goal}. I will send the notes and one simple path for the first workflow. If I missed the point, tell me and I will tighten it up.`,
  };
}

export function generateFollowUp(input: FollowUpInput): FollowUpOutput {
  const firstName = input.contact.split(" ")[0] || "there";
  const outcome =
    input.meetingOutcome ||
    "we narrowed the conversation to the first workflow and the people who need to weigh in";
  const promised =
    input.promisedItem ||
    "a short note that lays out the decision points and the next owner";
  const nextStep =
    input.nextStep ||
    "a 20-minute working session with the buyer and the team closest to the problem";
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + 3);

  return {
    email: `${firstName}, thanks for the time today. The part that stood out to me was that ${outcome}.\n\nI will send ${promised}. After that, the lightest next step is ${nextStep}.\n\nNo pressure if the timing is not right. I mainly want to make sure the next conversation is useful for your team.`,
    crmNote: `${input.account}: met with ${input.contact}. Main outcome: ${outcome}. Promised item: ${promised}. Recommended next step: ${nextStep}. Tone was constructive; keep follow-up short and specific.`,
    nextTask: `Send ${promised} to ${input.contact} and ask whether ${nextStep} is useful.`,
    nextFollowUpDate: nextDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }),
  };
}

export function reviewPatVoice(email: string): VoiceReviewResult {
  const normalized = email.toLowerCase();
  const flags = bannedLanguage
    .filter((term) => normalized.includes(term))
    .map((term) => `Replace "${term}" with plainer language.`);

  if (/demo|solution|platform|capabilities/.test(normalized)) {
    flags.push("The note may be talking about the product before the buyer's problem.");
  }

  if (email.length > 700) {
    flags.push("The note is long. Cut it to one reason, one useful idea, and one small ask.");
  }

  if (!/\?/.test(email)) {
    flags.push("Add one simple question so the buyer can answer without work.");
  }

  const rewrite = rewriteEmail(email);

  return {
    flags: flags.length
      ? flags
      : ["The note is already fairly plain. Tighten the ask and keep the tone relaxed."],
    rewrite,
  };
}

function rewriteEmail(email: string) {
  const subjectMatch = email.match(/subject:\s*(.*)/i);
  const subject = subjectMatch?.[1] || "A quick thought";
  const cleaned = email
    .replace(/hope this finds you well/gi, "")
    .replace(/just checking in/gi, "following up")
    .replace(/leverage/gi, "use")
    .replace(/robust/gi, "clear")
    .replace(/seamless/gi, "easier")
    .replace(/best-in-class/gi, "strong")
    .replace(/holistic/gi, "complete")
    .replace(/scalable solutions/gi, "a setup that can grow")
    .replace(/touch base/gi, "talk")
    .trim();

  const inferredAccount =
    cleaned.match(/northstar|summit|evergreen|prairie|lakeside/i)?.[0] ||
    "your team";

  return `Subject: ${subject.replace(/^subject:\s*/i, "")}

Hi there,

I saw the note about ${inferredAccount}, and one thing seemed worth asking about: what is the one workflow you most want to make easier before the next term?

If it helps, I can send a short example of how another team handled that without adding more reporting work. If not, no worries. I thought it was worth asking while the timing is fresh.`;
}

export function parseProspects(raw: string): ProspectRow[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [account, contact, role, segment, region, signal, ...notes] = line
        .split(",")
        .map((value) => value.trim());

      return {
        account: account || "Unknown account",
        contact: contact || "Unknown contact",
        role: role || "Unknown role",
        segment: segment || "Unknown segment",
        region: region || "Unknown region",
        signal: signal || "No signal listed",
        notes: notes.join(", ") || "No notes listed",
      };
    });
}

export function scoreProspects(rows: ProspectRow[]): ScoredProspect[] {
  return rows.map((row) => {
    const text = `${row.segment} ${row.signal} ${row.notes} ${row.role}`.toLowerCase();
    let score = 40;

    if (/university|college|academy|school|district/.test(text)) score += 18;
    if (/retention|student success|cte|clinical|gateway|analytics/.test(text))
      score += 18;
    if (/provost|cio|dean|vp|director|cfo/.test(text)) score += 12;
    if (/migration|renewal|launch|task force|board|new/.test(text)) score += 10;
    if (/no owner|unknown|stale/.test(text)) score -= 8;

    const capped = Math.max(22, Math.min(98, score));
    const fit =
      capped >= 78 ? "Strong" : capped >= 60 ? "Promising" : "Needs Research";

    return {
      ...row,
      score: capped,
      fit,
      outreachAngle: buildOutreachAngle(row, fit),
      missingResearch: findMissingResearch(row),
      actionBoard: buildActionBoard(row, fit),
    };
  });
}

function buildOutreachAngle(row: ProspectRow, fit: ScoredProspect["fit"]) {
  if (/retention|student success|gateway/i.test(`${row.signal} ${row.notes}`)) {
    return `Ask ${row.contact} which student risk signal needs attention before the next term.`;
  }

  if (/cte|clinical|healthcare/i.test(`${row.signal} ${row.notes}`)) {
    return `Tie the note to launch confidence and make the first ask about instructor workload.`;
  }

  if (/renewal|board|cio|spend/i.test(`${row.signal} ${row.notes}`)) {
    return `Lead with a practical issue review instead of asking for a demo slot.`;
  }

  return fit === "Strong"
    ? `Connect the message to ${row.signal.toLowerCase()} and ask for the owner of that work.`
    : `Ask one research question before pitching: what changed, who owns it, and when it matters.`;
}

function findMissingResearch(row: ProspectRow) {
  const missing: string[] = [];
  const text = `${row.contact} ${row.role} ${row.signal} ${row.notes}`.toLowerCase();

  if (/unknown|no contact/.test(text)) missing.push("Named buyer");
  if (!/provost|cio|dean|vp|director|cfo/.test(text))
    missing.push("Decision maker role");
  if (!/q[1-4]|fall|spring|summer|renewal|launch|board|term/.test(text))
    missing.push("Timing window");
  if (!/retention|cte|clinical|migration|support|analytics|gateway/.test(text))
    missing.push("Pain tied to Brightspace");

  return missing.length ? missing : ["No major gap. Verify timing before outreach."];
}

function buildActionBoard(row: ProspectRow, fit: ScoredProspect["fit"]) {
  const firstName = row.contact.split(" ")[0] || row.contact;

  if (fit === "Strong") {
    return [
      `Find one public proof point for ${row.signal}.`,
      `Send ${firstName} a short note with one question.`,
      "Create a task for a three-day follow-up.",
    ];
  }

  if (fit === "Promising") {
    return [
      "Confirm the buyer and timing.",
      "Find one program or initiative tied to the signal.",
      "Draft a low-pressure research note.",
    ];
  }

  return [
    "Research current LMS and active initiatives.",
    "Find a better buyer before outreach.",
    "Hold until a stronger trigger appears.",
  ];
}
