import type { AgentArtifact, AgentArtifactKind, AgentArtifactStatus } from "../../types";
import type { saveArtifact } from "../../services/storage";

export type CleanArtifactInput = Parameters<typeof saveArtifact>[0];

export type ImportPreviewRow = {
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

export type ArtifactImportInput = Partial<AgentArtifact> & {
  body?: unknown;
  title?: unknown;
  payload?: unknown;
};
