import type { AgentArtifact } from "../types";

const ARTIFACT_STORAGE_KEY = "sales-command-center.agent-artifacts.v1";

type ArtifactInput = Omit<AgentArtifact, "id" | "createdAt" | "updatedAt"> &
  Partial<Pick<AgentArtifact, "id" | "createdAt" | "updatedAt">>;

export interface ArtifactStore {
  loadArtifacts(): Promise<AgentArtifact[]>;
  saveArtifact(artifact: ArtifactInput): Promise<AgentArtifact>;
  updateArtifactStatus(
    artifactId: string,
    status: AgentArtifact["status"],
  ): Promise<AgentArtifact | undefined>;
  deleteArtifact(artifactId: string): Promise<void>;
}

class LocalStorageArtifactStore implements ArtifactStore {
  constructor(private readonly storageKey = ARTIFACT_STORAGE_KEY) {}

  async loadArtifacts(): Promise<AgentArtifact[]> {
    return this.readArtifacts();
  }

  async saveArtifact(artifact: ArtifactInput): Promise<AgentArtifact> {
    const artifacts = this.readArtifacts();
    const now = new Date().toISOString();
    const artifactToSave: AgentArtifact = {
      ...artifact,
      id: artifact.id ?? createArtifactId(),
      createdAt: artifact.createdAt ?? now,
      updatedAt: now,
    };
    const existingIndex = artifacts.findIndex((item) => item.id === artifactToSave.id);

    if (existingIndex >= 0) {
      const updatedArtifact = {
        ...artifacts[existingIndex],
        ...artifactToSave,
        createdAt: artifacts[existingIndex].createdAt,
        updatedAt: now,
      };
      artifacts[existingIndex] = updatedArtifact;
      this.writeArtifacts(artifacts);
      return updatedArtifact;
    } else {
      artifacts.unshift(artifactToSave);
    }

    this.writeArtifacts(artifacts);
    return artifactToSave;
  }

  async updateArtifactStatus(
    artifactId: string,
    status: AgentArtifact["status"],
  ): Promise<AgentArtifact | undefined> {
    const artifacts = this.readArtifacts();
    const artifact = artifacts.find((item) => item.id === artifactId);

    if (!artifact) {
      return undefined;
    }

    const updatedArtifact = {
      ...artifact,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.writeArtifacts(
      artifacts.map((item) => (item.id === artifactId ? updatedArtifact : item)),
    );

    return updatedArtifact;
  }

  async deleteArtifact(artifactId: string): Promise<void> {
    const artifacts = this.readArtifacts().filter((artifact) => artifact.id !== artifactId);
    this.writeArtifacts(artifacts);
  }

  private readArtifacts(): AgentArtifact[] {
    if (!isBrowserStorageAvailable()) {
      return [];
    }

    const rawArtifacts = window.localStorage.getItem(this.storageKey);

    if (!rawArtifacts) {
      return [];
    }

    try {
      const parsedArtifacts: unknown = JSON.parse(rawArtifacts);
      return Array.isArray(parsedArtifacts)
        ? parsedArtifacts.filter(isAgentArtifact)
        : [];
    } catch {
      return [];
    }
  }

  private writeArtifacts(artifacts: AgentArtifact[]) {
    if (!isBrowserStorageAvailable()) {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(artifacts));
  }
}

export const artifactStore: ArtifactStore = new LocalStorageArtifactStore();

export function loadArtifacts(store = artifactStore) {
  return store.loadArtifacts();
}

export function saveArtifact(artifact: ArtifactInput, store = artifactStore) {
  return store.saveArtifact(artifact);
}

export function updateArtifactStatus(
  artifactId: string,
  status: AgentArtifact["status"],
  store = artifactStore,
) {
  return store.updateArtifactStatus(artifactId, status);
}

export function deleteArtifact(artifactId: string, store = artifactStore) {
  return store.deleteArtifact(artifactId);
}

function isBrowserStorageAvailable() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function createArtifactId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `artifact-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isAgentArtifact(value: unknown): value is AgentArtifact {
  if (!value || typeof value !== "object") {
    return false;
  }

  const artifact = value as Record<string, unknown>;
  return (
    typeof artifact.id === "string" &&
    typeof artifact.title === "string" &&
    typeof artifact.kind === "string" &&
    typeof artifact.status === "string" &&
    typeof artifact.createdAt === "string" &&
    typeof artifact.updatedAt === "string"
  );
}
