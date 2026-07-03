import { Archive, Inbox, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { AgentArtifact } from "../types";
import {
  deleteArtifact,
  loadArtifacts,
  updateArtifactStatus,
} from "../services/storage";

export function AgentInbox() {
  const [artifacts, setArtifacts] = useState<AgentArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
                <dd>{formatTimestamp(artifact.createdAt)}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatTimestamp(artifact.updatedAt)}</dd>
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

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}
