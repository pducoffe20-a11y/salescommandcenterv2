import type {
  EmailDraft,
  Meeting,
  PriorityItem,
  ScoredProspect,
  Task,
} from "../types";
import type { MeetingPrepBrief } from "./generators";

export interface DownloadableExport {
  fileName: string;
  mimeType: string;
  contents: string;
}

export interface OutlookDraftPayload {
  subject: string;
  body: {
    contentType: "Text";
    content: string;
  };
  importance: "normal";
  internetMessageHeaders: Array<{
    name: string;
    value: string;
  }>;
}

export interface PlannerTaskPayload {
  title: string;
  dueDateTime: string;
  priority: number;
  details: {
    description: string;
  };
  checklist: Array<{
    title: string;
    isChecked: boolean;
  }>;
}

export interface OneNotePagePayload {
  title: string;
  html: string;
}

export interface TeamsMessagePayload {
  subject: string;
  body: {
    contentType: "html";
    content: string;
  };
}

const priorityRank: Record<Task["priority"], number> = {
  High: 3,
  Medium: 5,
  Low: 9,
};

/**
 * Formats an email draft as the Microsoft Graph message shape without sending it.
 * Replace this adapter with a createDraft call after Microsoft authentication is added.
 */
export function exportEmailDraftToOutlook(draft: EmailDraft): OutlookDraftPayload {
  return {
    subject: draft.subject,
    body: {
      contentType: "Text",
      content: `${draft.body}\n\nWhy it matters: ${draft.whyItMatters}\nNext action: ${draft.nextAction}`,
    },
    importance: "normal",
    internetMessageHeaders: [
      { name: "x-sales-command-center-account-id", value: draft.accountId },
      { name: "x-sales-command-center-contact-id", value: draft.contactId },
    ],
  };
}

/**
 * Formats a task as a Planner-ready payload. The priority values match the
 * Graph convention where lower numbers are more urgent.
 */
export function exportTaskToPlanner(task: Task): PlannerTaskPayload {
  return {
    title: task.title,
    dueDateTime: new Date(`${task.due}T17:00:00`).toISOString(),
    priority: priorityRank[task.priority],
    details: {
      description: [
        `Status: ${task.status}`,
        `Why it matters: ${task.whyItMatters}`,
        `Next action: ${task.nextAction}`,
        `Account ID: ${task.accountId}`,
        task.contactId ? `Contact ID: ${task.contactId}` : undefined,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    checklist: [
      { title: task.nextAction, isChecked: false },
      { title: "Log the outcome in the command center", isChecked: false },
    ],
  };
}

/**
 * Formats a generated brief as a OneNote page payload. This returns HTML for now;
 * later it can be sent to the OneNote pages endpoint.
 */
export function exportBriefToOneNote(
  brief: MeetingPrepBrief,
  meeting?: Meeting,
): OneNotePagePayload {
  const title = meeting?.title || brief.headline;

  return {
    title,
    html: [
      `<h1>${escapeHtml(title)}</h1>`,
      meeting ? `<p><strong>Meeting:</strong> ${escapeHtml(meeting.time)}</p>` : "",
      section("Account snapshot", brief.accountSnapshot),
      section("Contact angle", brief.contactAngle),
      listSection("Value angles", brief.valueAngles),
      listSection("Discovery questions", brief.discoveryQuestions),
      listSection("Likely objections", brief.objections),
      section("Opener", brief.opener),
      section("Soft next step", brief.softNextStep),
      section("Follow-up draft", brief.followUpDraft),
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

/**
 * Builds a CSV file that can be opened in Excel or uploaded to OneDrive.
 */
export function exportProspectsToExcel(
  prospects: ScoredProspect[],
  fileName = "scored-prospects.csv",
): DownloadableExport {
  const headers = [
    "Account",
    "Contact",
    "Role",
    "Segment",
    "Region",
    "Signal",
    "Notes",
    "Score",
    "Fit",
    "Outreach Angle",
    "Missing Research",
    "Action Board",
  ];

  const rows = prospects.map((prospect) => [
    prospect.account,
    prospect.contact,
    prospect.role,
    prospect.segment,
    prospect.region,
    prospect.signal,
    prospect.notes,
    String(prospect.score),
    prospect.fit,
    prospect.outreachAngle,
    prospect.missingResearch.join("; "),
    prospect.actionBoard.join("; "),
  ]);

  return {
    fileName,
    mimeType: "text/csv;charset=utf-8",
    contents: [headers, ...rows].map(toCsvRow).join("\n"),
  };
}

/**
 * Formats a priority item as a Teams message card body without posting it.
 */
export function postPriorityToTeams(priority: PriorityItem): TeamsMessagePayload {
  return {
    subject: `Priority: ${priority.title}`,
    body: {
      contentType: "html",
      content: [
        `<h2>${escapeHtml(priority.title)}</h2>`,
        `<p><strong>Signal:</strong> ${escapeHtml(priority.signalType)}</p>`,
        `<p><strong>Urgency:</strong> ${priority.urgency}/100</p>`,
        `<p><strong>Why it matters:</strong> ${escapeHtml(priority.whyItMatters)}</p>`,
        `<p><strong>Recommended action:</strong> ${escapeHtml(priority.recommendedAction)}</p>`,
        `<p><strong>Soft CTA:</strong> ${escapeHtml(priority.softCta)}</p>`,
      ].join("\n"),
    },
  };
}

function section(title: string, content: string) {
  return `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(content)}</p>`;
}

function listSection(title: string, items: string[]) {
  return `<h2>${escapeHtml(title)}</h2><ul>${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function toCsvRow(values: string[]) {
  return values.map(toCsvCell).join(",");
}

function toCsvCell(value: string) {
  const normalized = value.replace(/\r?\n/g, " ");
  return /[",\n]/.test(normalized)
    ? `"${normalized.replace(/"/g, '""')}"`
    : normalized;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
