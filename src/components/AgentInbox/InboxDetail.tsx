import type { AgentArtifact } from "../../types";
import { ArtifactViewer } from "./ArtifactViewer";

type InboxDetailProps = {
  artifact: AgentArtifact;
  timestampFormatter: Intl.DateTimeFormat;
};

export function InboxDetail({ artifact, timestampFormatter }: InboxDetailProps) {
  return (
    <>
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
        {artifact.source && (
          <div>
            <dt>Source</dt>
            <dd>{artifact.source}</dd>
          </div>
        )}
      </dl>
      <ArtifactViewer artifact={artifact} />
    </>
  );
}
