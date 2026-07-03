import { Archive, Inbox, Upload, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AgentArtifact, AgentArtifactKind, AgentArtifactStatus } from "../types";
import {
  deleteArtifact,
  loadArtifacts,
  saveArtifact,
  updateArtifactStatus,
} from "../services/storage";

export function AgentInbox() {
  const [artifacts, setArtifacts] = useState<AgentArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importText, setImportText] = useState(sampleArtifactImport);
  const [importMessage, setImportMessage] = useState("");

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

  async function markArchived(artifactId: string) {
    const updatedArtifact = await updateArtifactStatus(artifactId, "Archived");

    if (!updatedArtifact) {
      return;
    }

    setArtifacts((currentArtifacts) =>
      currentArtifacts.map((artifact) =>
        artifact.id === artifactId ? updatedArtifact : artifact,
      ),
    );
  }

  async function removeArtifact(artifactId: string) {
    await deleteArtifact(artifactId);
    setArtifacts((currentArtifacts) =>
      currentArtifacts.filter((artifact) => artifact.id !== artifactId),
    );
  }

  async function importArtifacts() {
    try {
      const parsedArtifacts = parseArtifactImport(importText);
      const savedArtifacts = await Promise.all(
        parsedArtifacts.map((artifact) => saveArtifact(artifact)),
      );

      setArtifacts((currentArtifacts) => mergeArtifacts(savedArtifacts, currentArtifacts));
      setImportMessage(`Imported ${savedArtifacts.length} clean artifact${savedArtifacts.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "Import failed.");
    }
  }

  const timestampFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  return (
    <section className="panel agent-inbox" aria-labelledby="agent-inbox-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Agent inbox</span>
          <h1 id="agent-inbox-heading">Generated work ready for review</h1>
          <p>
            Agent artifacts are loaded through the storage service so this view can
            move from local persistence to Microsoft 365 or backend storage later.
          </p>
        </div>
        <Inbox size={22} aria-hidden="true" />
      </div>

      <section className="agent-import-panel" aria-labelledby="agent-import-heading">
        <div>
          <h2 id="agent-import-heading">Clean import</h2>
          <p>
            Paste one artifact or an array of artifacts. The importer trims text,
            applies safe defaults, and upserts by id so repeated imports stay clean.
          </p>
        </div>
        <textarea
          aria-label="Agent artifact JSON import"
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          spellCheck={false}
        />
        <div className="agent-import-actions">
          <button className="primary-button" type="button" onClick={importArtifacts}>
            <Upload size={16} aria-hidden="true" />
            Import artifacts
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
                className="text-button"
                type="button"
                onClick={() => markArchived(artifact.id)}
                disabled={artifact.status === "Archived"}
              >
                <Archive size={16} aria-hidden="true" />
                Archive
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

const validStatuses: AgentArtifactStatus[] = ["Draft", "Ready", "Shared", "Archived"];

const sampleArtifactImport = JSON.stringify(
  [
    {
      kind: "Research note",
      status: "Ready",
      title: "Imported enrollment signal",
      body: "New agent note: validate the enrollment initiative before outreach.",
      source: "Clean JSON import",
    },
  ],
  null,
  2,
);

type ArtifactImportInput = Partial<AgentArtifact> & { body?: unknown; title?: unknown };

function parseArtifactImport(rawImport: string) {
  let parsedImport: unknown;

  try {
    parsedImport = JSON.parse(rawImport);
  } catch {
    throw new Error("Import must be valid JSON.");
  }

  const artifactInputs = Array.isArray(parsedImport) ? parsedImport : [parsedImport];

  if (artifactInputs.length === 0) {
    throw new Error("Import must include at least one artifact.");
  }

  return artifactInputs.map(cleanArtifactInput);
}

function cleanArtifactInput(input: unknown) {
  if (!input || typeof input !== "object") {
    throw new Error("Each artifact must be a JSON object.");
  }

  const artifact = input as ArtifactImportInput;
  const title = cleanRequiredText(artifact.title, "title");
  const body = cleanRequiredText(artifact.body, "body");
  const kind = validKinds.includes(artifact.kind as AgentArtifactKind)
    ? (artifact.kind as AgentArtifactKind)
    : "Research note";
  const status = validStatuses.includes(artifact.status as AgentArtifactStatus)
    ? (artifact.status as AgentArtifactStatus)
    : "Draft";

  return {
    id: typeof artifact.id === "string" && artifact.id.trim() ? artifact.id.trim() : undefined,
    kind,
    status,
    title,
    body,
    accountId: cleanOptionalText(artifact.accountId),
    contactId: cleanOptionalText(artifact.contactId),
    source: cleanOptionalText(artifact.source),
    metadata: artifact.metadata,
  };
}

function cleanRequiredText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Each artifact needs a ${field}.`);
  }

  return value.trim();
}

function cleanOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function mergeArtifacts(importedArtifacts: AgentArtifact[], currentArtifacts: AgentArtifact[]) {
  return Array.from(
    new Map(
      [...importedArtifacts, ...currentArtifacts].map((artifact) => [artifact.id, artifact]),
    ).values(),
  );
}
