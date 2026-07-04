import type { AgentArtifact, AgentArtifactKind, AgentArtifactStatus, JsonValue } from "../../types";
import type { ArtifactImportInput, ImportPreviewRow } from "./types";

export const validKinds: AgentArtifactKind[] = [
  "Meeting prep",
  "Follow-up",
  "Pre-call brief",
  "Voice review",
  "Research note",
];

export const validStatuses: AgentArtifactStatus[] = ["Imported", "Promoted", "Archived", "Rejected"];

export const sampleArtifactImport = JSON.stringify(
  [
    {
      kind: "Research note",
      status: "Imported",
      title: "Imported enrollment signal",
      body: "New agent note: validate the enrollment initiative before outreach.",
      source: "Clean JSON import",
      payload: {
        accounts: [
          {
            accountId: "brightpath",
            accountName: "Brightpath Learning Council",
            stage: "Imported signal",
            fitScore: 84,
            timingScore: 78,
            snapshot: "Imported enrollment initiative signal.",
            recommendedAction: "Validate whether enrollment reporting is a current priority.",
            triggers: [
              {
                title: "Enrollment initiative signal",
                source: "Agent import",
                whyItMatters: "Could indicate near-term learner experience work.",
                nextAction: "Ask who owns enrollment reporting and learner engagement.",
              },
            ],
            actionItems: [
              {
                accountId: "brightpath",
                title: "Validate enrollment reporting priority",
                priority: "High",
                status: "This Week",
              },
            ],
            emailDrafts: [
              {
                accountId: "brightpath",
                subject: "Enrollment reporting question",
                body: "Hi — I saw a note that enrollment reporting may be getting attention. Is improving learner visibility a current priority, or should I not read too much into that?",
              },
            ],
          },
        ],
      },
    },
  ],
  null,
  2,
);

export function parseArtifactImport(rawImport: string): ImportPreviewRow[] {
  let parsedImport: unknown;

  if (!rawImport.trim()) {
    return [];
  }

  try {
    parsedImport = JSON.parse(rawImport);
  } catch {
    return [createInvalidPreviewRow(0, undefined, "Import must be valid JSON.")];
  }

  const artifactInputs = Array.isArray(parsedImport) ? parsedImport : [parsedImport];

  if (artifactInputs.length === 0) {
    return [createInvalidPreviewRow(0, undefined, "Import must include at least one artifact.")];
  }

  return artifactInputs.map((input, index) => cleanArtifactInput(input, index));
}

export function mergeArtifacts(importedArtifacts: AgentArtifact[], currentArtifacts: AgentArtifact[]) {
  return Array.from(
    new Map([...importedArtifacts, ...currentArtifacts].map((artifact) => [artifact.id, artifact])).values(),
  );
}

function cleanArtifactInput(input: unknown, index: number): ImportPreviewRow {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createInvalidPreviewRow(index, input, "Each artifact must be a JSON object.");
  }

  const artifact = input as ArtifactImportInput;
  const errors = [
    getRequiredTextError(artifact.title, "title"),
    getRequiredTextError(artifact.body, "body"),
    getMetadataError(artifact.metadata),
    getPayloadError(artifact.payload),
  ].filter(Boolean);

  const kind = validKinds.includes(artifact.kind as AgentArtifactKind)
    ? (artifact.kind as AgentArtifactKind)
    : "Research note";
  const status = validStatuses.includes(artifact.status as AgentArtifactStatus)
    ? (artifact.status as AgentArtifactStatus)
    : "Imported";
  const title = cleanRequiredText(artifact.title) || "—";
  const source = cleanOptionalText(artifact.source) ?? "—";

  if (errors.length > 0) {
    return {
      rowId: `row-${index}`,
      index,
      kind,
      status,
      title,
      source,
      validationStatus: "Invalid",
      errorMessage: `${errors.join(" ")} Correct the JSON and the preview will update.`,
    };
  }

  return {
    rowId: `row-${index}`,
    index,
    kind,
    status,
    title,
    source,
    validationStatus: "Valid",
    errorMessage: "",
    artifact: {
      id: cleanOptionalText(artifact.id),
      kind,
      status,
      title: cleanRequiredText(artifact.title),
      body: cleanRequiredText(artifact.body),
      accountId: cleanOptionalText(artifact.accountId),
      contactId: cleanOptionalText(artifact.contactId),
      source: cleanOptionalText(artifact.source),
      metadata: isJsonObject(artifact.metadata) ? artifact.metadata : undefined,
      payload: isJsonValue(artifact.payload) ? artifact.payload : undefined,
    },
  };
}

function createInvalidPreviewRow(index: number, input: unknown, errorMessage: string): ImportPreviewRow {
  const artifact = input && typeof input === "object" && !Array.isArray(input) ? (input as ArtifactImportInput) : undefined;

  return {
    rowId: `row-${index}`,
    index,
    kind: validKinds.includes(artifact?.kind as AgentArtifactKind) ? (artifact?.kind as AgentArtifactKind) : "—",
    status: validStatuses.includes(artifact?.status as AgentArtifactStatus) ? (artifact?.status as AgentArtifactStatus) : "—",
    title: cleanRequiredText(artifact?.title) || "—",
    source: cleanOptionalText(artifact?.source) ?? "—",
    validationStatus: "Invalid",
    errorMessage: `${errorMessage} Correct the JSON and the preview will update.`,
  };
}

function cleanRequiredText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getRequiredTextError(value: unknown, field: string) {
  return typeof value !== "string" || !value.trim() ? `Each artifact needs a ${field}.` : "";
}

function getMetadataError(metadata: unknown) {
  if (metadata === undefined) return "";
  if (!isJsonObject(metadata)) return "Metadata must be an object with JSON-compatible values.";
  return "";
}

function getPayloadError(payload: unknown) {
  if (payload === undefined) return "";
  return isJsonValue(payload) ? "" : "Payload must be valid JSON data.";
}

function isJsonObject(value: unknown): value is Record<string, JsonValue> {
  return !!value && typeof value === "object" && !Array.isArray(value) && isJsonValue(value);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;
  if (["string", "number", "boolean"].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every(isJsonValue);
  }
  return false;
}
