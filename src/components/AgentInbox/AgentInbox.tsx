import { Inbox } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AgentArtifact, AgentArtifactStatus } from "../../types";
import type { NormalizedSalesData } from "../../services/agentImports";
import { promoteAgentArtifact, savePromotedSalesData } from "../../services/agentImports";
import { deleteArtifact, loadArtifacts, saveArtifact, updateArtifactStatus } from "../../services/storage";
import { mergeArtifacts, parseArtifactImport, sampleArtifactImport } from "./artifactImport";
import { InboxFilter } from "./InboxFilter";
import { InboxItem } from "./InboxItem";
import type { CleanArtifactInput, ImportPreviewRow } from "./types";

interface AgentInboxProps {
  promotedData: NormalizedSalesData;
  onPromotedDataChange: (data: NormalizedSalesData) => void;
}

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

  async function setArtifactStatus(artifactId: string, status: AgentArtifactStatus) {
    const updatedArtifact = await updateArtifactStatus(artifactId, status);

    if (!updatedArtifact) {
      return;
    }

    setArtifacts((currentArtifacts) =>
      currentArtifacts.map((artifact) => (artifact.id === artifactId ? updatedArtifact : artifact)),
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
    setArtifacts((currentArtifacts) => currentArtifacts.filter((artifact) => artifact.id !== artifactId));
  }

  function updateImportPreview(nextImportText: string) {
    setImportText(nextImportText);
    setImportMessage("");
    setImportPreviewRows(parseArtifactImport(nextImportText));
  }

  async function importArtifacts() {
    const validRows = importPreviewRows.filter(
      (row): row is ImportPreviewRow & { artifact: CleanArtifactInput } => Boolean(row.artifact),
    );
    const invalidRows = importPreviewRows.filter((row) => !row.artifact);

    if (validRows.length === 0) {
      setImportMessage("No valid artifacts to import. Fix the invalid rows and try again.");
      return;
    }

    const savedArtifacts = await Promise.all(validRows.map((row) => saveArtifact(row.artifact)));

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

  return (
    <section className="agent-inbox workflow-page" aria-labelledby="agent-inbox-heading">
      <header className="tool-header agent-inbox-header">
        <div className="agent-inbox-title">
          <div>
            <span className="eyebrow">Agent inbox</span>
            <h1 id="agent-inbox-heading">Generated work ready for review</h1>
            <p>
              Import artifacts, review lifecycle status, and promote accepted work into the shared
              command center data used by the dashboards.
            </p>
          </div>
          <Inbox size={24} aria-hidden="true" />
        </div>
        <div className="agent-inbox-stats" aria-label="Agent inbox totals">
          <span className="status-chip">{artifacts.length} saved</span>
          <span className="status-chip">{importPreviewRows.length} in preview</span>
          <span className="status-chip">{promotedData.accounts.length} accounts live</span>
        </div>
      </header>

      <InboxFilter
        importText={importText}
        importMessage={importMessage}
        importPreviewRows={importPreviewRows}
        fileInputRef={fileInputRef}
        onImportTextChange={updateImportPreview}
        onFileImport={handleFileImport}
        onImportArtifacts={importArtifacts}
        onClearImport={clearImport}
      />

      {isLoading && <p>Loading saved artifacts...</p>}

      {!isLoading && artifacts.length === 0 && (
        <div className="empty-state">
          <strong>No saved agent artifacts yet.</strong>
          <p>
            Generate and save meeting prep, follow-ups, briefs, or research notes to populate this
            inbox from persistent storage.
          </p>
        </div>
      )}

      <div className="artifact-list">
        {artifacts.map((artifact) => (
          <InboxItem
            key={artifact.id}
            artifact={artifact}
            timestampFormatter={timestampFormatter}
            onPromote={promoteArtifact}
            onSetStatus={setArtifactStatus}
            onRemove={removeArtifact}
          />
        ))}
      </div>
    </section>
  );
}
