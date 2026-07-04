import { Archive, CheckCircle2, Trash2, XCircle } from "lucide-react";
import type { AgentArtifact, AgentArtifactStatus } from "../../types";
import { InboxDetail } from "./InboxDetail";

type InboxItemProps = {
  artifact: AgentArtifact;
  timestampFormatter: Intl.DateTimeFormat;
  onPromote: (artifact: AgentArtifact) => void;
  onSetStatus: (artifactId: string, status: AgentArtifactStatus) => void;
  onRemove: (artifactId: string) => void;
};

export function InboxItem({
  artifact,
  timestampFormatter,
  onPromote,
  onSetStatus,
  onRemove,
}: InboxItemProps) {
  return (
    <article className="artifact-card">
      <div className="card-topline">
        <span>{artifact.kind}</span>
        <strong>{artifact.status}</strong>
      </div>
      <h2>{artifact.title}</h2>
      <InboxDetail artifact={artifact} timestampFormatter={timestampFormatter} />
      <div className="card-actions">
        <button
          className="primary-button"
          type="button"
          onClick={() => onPromote(artifact)}
          disabled={artifact.status === "Promoted" || artifact.status === "Rejected"}
        >
          <CheckCircle2 size={16} aria-hidden="true" />
          Promote to command center
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => onSetStatus(artifact.id, "Archived")}
          disabled={artifact.status === "Archived" || artifact.status === "Promoted"}
        >
          <Archive size={16} aria-hidden="true" />
          Archive
        </button>
        <button
          className="text-button danger-button"
          type="button"
          onClick={() => onSetStatus(artifact.id, "Rejected")}
          disabled={artifact.status === "Rejected" || artifact.status === "Promoted"}
        >
          <XCircle size={16} aria-hidden="true" />
          Reject
        </button>
        <button className="text-button danger-button" type="button" onClick={() => onRemove(artifact.id)}>
          <Trash2 size={16} aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
}
