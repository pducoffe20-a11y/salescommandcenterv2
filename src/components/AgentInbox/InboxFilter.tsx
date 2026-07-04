import { Upload } from "lucide-react";
import type { RefObject } from "react";
import type { ImportPreviewRow } from "./types";

type InboxFilterProps = {
  importText: string;
  importMessage: string;
  importPreviewRows: ImportPreviewRow[];
  fileInputRef: RefObject<HTMLInputElement>;
  onImportTextChange: (value: string) => void;
  onFileImport: (file: File | undefined) => void;
  onImportArtifacts: () => void;
  onClearImport: () => void;
};

export function InboxFilter({
  importText,
  importMessage,
  importPreviewRows,
  fileInputRef,
  onImportTextChange,
  onFileImport,
  onImportArtifacts,
  onClearImport,
}: InboxFilterProps) {
  const validPreviewCount = importPreviewRows.filter((row) => row.artifact).length;

  return (
    <section className="agent-import-panel" aria-labelledby="agent-import-heading">
      <div>
        <h2 id="agent-import-heading">Clean import</h2>
        <p>
          Paste or upload one artifact or an array of artifacts. Add a payload with accounts,
          contacts, meetings, triggers, actionItems, and emailDrafts to promote directly through
          the shared normalizers.
        </p>
      </div>
      <label className="agent-file-import">
        <span>Upload JSON artifact file</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={(event) => onFileImport(event.target.files?.[0])}
        />
      </label>
      <textarea
        aria-label="Agent artifact JSON import"
        value={importText}
        onChange={(event) => onImportTextChange(event.target.value)}
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
        <button className="primary-button" type="button" onClick={onImportArtifacts}>
          <Upload size={16} aria-hidden="true" />
          Import valid artifacts
        </button>
        <button className="text-button" type="button" onClick={onClearImport}>
          Clear import
        </button>
        {importMessage && <span role="status">{importMessage}</span>}
      </div>
    </section>
  );
}
