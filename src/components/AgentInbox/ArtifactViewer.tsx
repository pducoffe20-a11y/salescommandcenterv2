import type { AgentArtifact } from "../../types";

type ArtifactViewerProps = {
  artifact: AgentArtifact;
};

export function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  if (!artifact.payload && !artifact.metadata) {
    return null;
  }

  return (
    <details className="artifact-viewer">
      <summary>View artifact data</summary>
      {artifact.payload && (
        <pre aria-label="Artifact payload">{JSON.stringify(artifact.payload, null, 2)}</pre>
      )}
      {artifact.metadata && (
        <pre aria-label="Artifact metadata">{JSON.stringify(artifact.metadata, null, 2)}</pre>
      )}
    </details>
  );
}
