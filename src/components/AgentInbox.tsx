export { AgentInbox } from "./AgentInbox/AgentInbox";
import { Archive, CheckCircle2, Inbox, Trash2, Upload, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AgentArtifact, AgentArtifactKind, AgentArtifactStatus, JsonValue } from "../types";
import { deleteArtifact, loadArtifacts, saveArtifact, updateArtifactStatus } from "../services/storage";
import type { NormalizedSalesData } from "../services/agentImports";
import { promoteAgentArtifact, savePromotedSalesData } from "../services/agentImports";

interface AgentInboxProps {
  promotedData: NormalizedSalesData;
  onPromotedDataChange: (data: NormalizedSalesData) => void;
}

type ArtifactImportInput = Partial<AgentArtifact> & { body?: unknown; title?: unknown; payload?: unknown };
type CleanArtifactInput = Parameters<typeof saveArtifact>[0];

type ImportPreviewRow = {
  rowId: string;
  index: number;
  kind: AgentArtifactKind | "—";
  status: AgentArtifactStatus | "—";
  title: string;
  source: string;
  validationStatus: "Valid" | "Invalid";
  errorMessage: string;
  artifact?: CleanArtifactInput;
};

export function AgentInbox({ promotedData, onPromotedDataChange }: AgentInboxProps) {
  const [artifacts, setArtifacts] = useState<AgentArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importText, setImportText] = useState(sampleArtifactImport);
  const [importMessage, setImportMessage] = useState("");
  const [importPreviewRows, setImportPreviewRows] = useState<ImportPreviewRow[]>(() =>
    parseArtifactImport(sampleArtifactImport),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    loadArtifacts()
      .then((loadedArtifacts) => {
        if (isMounted) {
          setArtifacts(loadedArtifacts);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function setArtifactStatus(
    artifactId: string,
    status: AgentArtifactStatus,
  ) {
    const updatedArtifact = await updateArtifactStatus(artifactId, status);

    if (!updatedArtifact) {
      return;
    }

    setArtifacts((currentArtifacts) =>
      currentArtifacts.map((artifact) =>
        artifact.id === artifactId ? updatedArtifact : artifact,
      ),
    );
  }

  async function promoteArtifact(artifact: AgentArtifact) {
    const nextData = promoteAgentArtifact(artifact, promotedData);
    savePromotedSalesData(nextData);
    onPromotedDataChange(nextData);
    await setArtifactStatus(artifact.id, "Promoted");
    setImportMessage(`Promoted “${artifact.title}” to command center.`);
  }

  async function removeArtifact(artifactId: string) {
    await deleteArtifact(artifactId);
    setArtifacts((currentArtifacts) =>
      currentArtifacts.filter((artifact) => artifact.id !== artifactId),
    );
  }

  function updateImportPreview(nextImportText: string) {
    setImportText(nextImportText);
    setImportMessage("");
    setImportPreviewRows(parseArtifactImport(nextImportText));
  }

  async function importArtifacts() {
    const previewRows = importPreviewRows;
    const validRows = previewRows.filter(
      (row): row is ImportPreviewRow & { artifact: CleanArtifactInput } => Boolean(row.artifact),
    );
    const invalidRows = previewRows.filter((row) => !row.artifact);

    if (validRows.length === 0) {
      setImportPreviewRows(previewRows);
      setImportMessage("No valid artifacts to import. Fix the invalid rows and try again.");
      return;
    }

    const savedArtifacts = await Promise.all(
      validRows.map((row) => saveArtifact(row.artifact)),
    );

    setArtifacts((currentArtifacts) => mergeArtifacts(savedArtifacts, currentArtifacts));
    setImportPreviewRows(invalidRows);
    setImportMessage(
      `Imported ${savedArtifacts.length} artifact${savedArtifacts.length === 1 ? "" : "s"}.` +
        (invalidRows.length > 0
          ? ` ${invalidRows.length} invalid row${invalidRows.length === 1 ? "" : "s"} remain visible for correction.`
          : ""),
    );
  }

  function clearImport() {
    setImportText("");
    setImportPreviewRows([]);
    setImportMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileImport(file: File | undefined) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateImportPreview(reader.result);
        setImportMessage(`Loaded ${file.name}. Review the preview before saving.`);
      } else {
        setImportMessage("Could not read the selected JSON file.");
      }
    };
    reader.onerror = () => setImportMessage("Could not read the selected JSON file.");
    reader.readAsText(file);
  }

  const timestampFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  const validPreviewCount = importPreviewRows.filter((row) => row.artifact).length;

  return (
    <section className="panel agent-inbox" aria-labelledby="agent-inbox-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Agent inbox</span>
          <h1 id="agent-inbox-heading">Generated work ready for review</h1>
          <p>
            Import artifacts, review their lifecycle status, then explicitly promote
            accepted work into the shared command center data used by the dashboards.
          </p>
        </div>
        <Inbox size={22} aria-hidden="true" />
      </div>

      <section className="agent-import-panel" aria-labelledby="agent-import-heading">
        <div>
          <h2 id="agent-import-heading">Clean import</h2>
          <p>
            Paste one artifact or an array of artifacts. Add a payload with accounts,
            contacts, meetings, triggers, actionItems, and emailDrafts to promote
            directly through the shared normalizers.
            Paste or upload one artifact or an array of artifacts. Review the preview,
            then import valid rows while invalid rows stay visible for correction.
          </p>
        </div>
        <label className="agent-file-import">
          <span>Upload JSON artifact file</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={(event) => handleFileImport(event.target.files?.[0])}
          />
        </label>
        <textarea
          aria-label="Agent artifact JSON import"
          value={importText}
          onChange={(event) => updateImportPreview(event.target.value)}
          spellCheck={false}
        />
        {importPreviewRows.length > 0 && (
          <div className="agent-import-preview" aria-live="polite">
            <div className="preview-summary">
              <strong>Import preview</strong>
              <span>
                {validPreviewCount} valid / {importPreviewRows.length - validPreviewCount} invalid
              </span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Kind</th>
                    <th scope="col">Status</th>
                    <th scope="col">Title</th>
                    <th scope="col">Source</th>
                    <th scope="col">Validation</th>
                    <th scope="col">Error message</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreviewRows.map((row) => (
                    <tr key={row.rowId} className={row.artifact ? "valid-row" : "invalid-row"}>
                      <td>{row.kind}</td>
                      <td>{row.status}</td>
                      <td>{row.title}</td>
                      <td>{row.source}</td>
                      <td>{row.validationStatus}</td>
                      <td>{row.errorMessage || "Ready to import."}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="agent-import-actions">
          <button className="primary-button" type="button" onClick={importArtifacts}>
            <Upload size={16} aria-hidden="true" />
            Import valid artifacts
          </button>
          <button className="text-button" type="button" onClick={clearImport}>
            Clear import
          </button>
          {importMessage && <span role="status">{importMessage}</span>}
        </div>
      </section>

      {isLoading && <p>Loading saved artifacts…</p>}

      {!isLoading && artifacts.length === 0 && (
        <div className="empty-state">
          <strong>No saved agent artifacts yet.</strong>
          <p>
            Generate and save meeting prep, follow-ups, briefs, or research notes
            to populate this inbox from persistent storage.
          </p>
        </div>
      )}

      <div className="artifact-list">
        {artifacts.map((artifact) => (
          <article className="artifact-card" key={artifact.id}>
            <div className="card-topline">
              <span>{artifact.kind}</span>
              <strong>{artifact.status}</strong>
            </div>
            <h2>{artifact.title}</h2>
            <p>{artifact.body}</p>
            <dl className="mini-facts">
              <div>
                <dt>Created</dt>
                <dd>{timestampFormatter.format(new Date(artifact.createdAt))}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{timestampFormatter.format(new Date(artifact.updatedAt))}</dd>
              </div>
            </dl>
            <div className="card-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => promoteArtifact(artifact)}
                disabled={artifact.status === "Promoted" || artifact.status === "Rejected"}
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                Promote to command center
              </button>
              <button
                className="text-button"
                type="button"
                onClick={() => setArtifactStatus(artifact.id, "Archived")}
                disabled={artifact.status === "Archived" || artifact.status === "Promoted"}
              >
                <Archive size={16} aria-hidden="true" />
                Archive
              </button>
              <button
                className="text-button danger-button"
                type="button"
                onClick={() => setArtifactStatus(artifact.id, "Rejected")}
                disabled={artifact.status === "Rejected" || artifact.status === "Promoted"}
              >
                <XCircle size={16} aria-hidden="true" />
                Reject
              </button>
              <button
                className="text-button danger-button"
                type="button"
                onClick={() => removeArtifact(artifact.id)}
              >
                <Trash2 size={16} aria-hidden="true" />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const validKinds: AgentArtifactKind[] = [
  "Meeting prep",
  "Follow-up",
  "Pre-call brief",
  "Voice review",
  "Research note",
];

const validStatuses: AgentArtifactStatus[] = ["Imported", "Promoted", "Archived", "Rejected"];

const sampleArtifactImport = JSON.stringify(
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

function parseArtifactImport(rawImport: string): ImportPreviewRow[] {
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

function cleanArtifactInput(input: unknown, index: number): ImportPreviewRow {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createInvalidPreviewRow(index, input, "Each artifact must be a JSON object.");
  }

  const artifact = input as ArtifactImportInput;
  const errors = [
    getRequiredTextError(artifact.title, "title"),
    getRequiredTextError(artifact.body, "body"),
    getMetadataError(artifact.metadata),
  ].filter(Boolean);

  const kind = validKinds.includes(artifact.kind as AgentArtifactKind)
    ? (artifact.kind as AgentArtifactKind)
    : "Research note";
  const status = validStatuses.includes(artifact.status as AgentArtifactStatus)
    ? (artifact.status as AgentArtifactStatus)
    : "Imported";
  const title = typeof artifact.title === "string" && artifact.title.trim() ? artifact.title.trim() : "—";
  const body = cleanRequiredText(artifact.body);
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
      id: typeof artifact.id === "string" && artifact.id.trim() ? artifact.id.trim() : undefined,
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
    kind: validKinds.includes(artifact?.kind as AgentArtifactKind)
      ? (artifact?.kind as AgentArtifactKind)
      : "—",
    status: validStatuses.includes(artifact?.status as AgentArtifactStatus)
      ? (artifact?.status as AgentArtifactStatus)
      : "—",
    title: typeof artifact?.title === "string" && artifact.title.trim() ? artifact.title.trim() : "—",
    source: cleanOptionalText(artifact?.source) ?? "—",
    validationStatus: "Invalid",
    errorMessage: `${errorMessage} Correct the JSON and the preview will update.`,
  };
}

function cleanRequiredText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getRequiredTextError(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    return `Each artifact needs a ${field}.`;
  }

  return "";
}

function cleanOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getMetadataError(metadata: unknown) {
  if (metadata === undefined) {
    return "";
  }

  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "Metadata must be an object with string, number, boolean, or null values.";
  }

  const invalidKey = Object.entries(metadata).find(([, value]) => !isAllowedMetadataValue(value))?.[0];

  return invalidKey
    ? `Metadata value for "${invalidKey}" must be a string, number, boolean, or null.`
    : "";
}

function isAllowedMetadataValue(value: unknown) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

function mergeArtifacts(importedArtifacts: AgentArtifact[], currentArtifacts: AgentArtifact[]) {
  return Array.from(
    new Map([...importedArtifacts, ...currentArtifacts].map((artifact) => [artifact.id, artifact])).values(),
  );
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
