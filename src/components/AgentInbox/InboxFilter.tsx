import { AlertTriangle, CheckCircle2, Eraser, FileUp, Upload } from "lucide-react";
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
  const invalidPreviewCount = importPreviewRows.length - validPreviewCount;

  return (
    <section className="agent-import-panel" aria-labelledby="agent-import-heading">
      <div className="agent-import-panel-header">
        <div>
          <span className="eyebrow">Import queue</span>
          <h2 id="agent-import-heading">Clean import</h2>
          <p>Review generated artifacts before they enter shared command center data.</p>
        </div>
        <label className="agent-file-import">
          <FileUp size={17} aria-hidden="true" />
          <span>Upload JSON</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            aria-label="Upload JSON artifact file"
            onChange={(event) => onFileImport(event.target.files?.[0])}
          />
        </label>
      </div>

      <div className="agent-import-grid">
        <label className="agent-import-editor">
          <span>Artifact JSON</span>
          <textarea
            aria-label="Agent artifact JSON import"
            value={importText}
            onChange={(event) => onImportTextChange(event.target.value)}
            spellCheck={false}
          />
        </label>

        <div className="agent-import-preview" aria-live="polite">
          <div className="preview-summary">
            <strong>Preview</strong>
            <div className="preview-counts">
              <span className="status-chip">
                <CheckCircle2 size={14} aria-hidden="true" />
                {validPreviewCount} valid
              </span>
              <span className={`status-chip ${invalidPreviewCount > 0 ? "invalid-chip" : ""}`}>
                <AlertTriangle size={14} aria-hidden="true" />
                {invalidPreviewCount} invalid
              </span>
            </div>
          </div>

          {importPreviewRows.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Kind</th>
                    <th scope="col">Status</th>
                    <th scope="col">Title</th>
                    <th scope="col">Source</th>
                    <th scope="col">Validation</th>
                    <th scope="col">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreviewRows.map((row) => (
                    <tr key={row.rowId} className={row.artifact ? "valid-row" : "invalid-row"}>
                      <td>{row.kind}</td>
                      <td>{row.status}</td>
                      <td className="preview-title">{row.title}</td>
                      <td>{row.source}</td>
                      <td>
                        <span className={`validation-badge ${row.artifact ? "valid" : "invalid"}`}>
                          {row.artifact ? (
                            <CheckCircle2 size={13} aria-hidden="true" />
                          ) : (
                            <AlertTriangle size={13} aria-hidden="true" />
                          )}
                          {row.validationStatus}
                        </span>
                      </td>
                      <td>{row.errorMessage || "Ready to import."}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state import-empty">
              <strong>No preview rows.</strong>
              <p>Add JSON to stage artifacts for validation.</p>
            </div>
          )}
        </div>
      </div>

      <div className="agent-import-actions">
        <button
          className="primary-button"
          type="button"
          onClick={onImportArtifacts}
          disabled={validPreviewCount === 0}
        >
          <Upload size={16} aria-hidden="true" />
          Import valid artifacts
        </button>
        <button className="text-button" type="button" onClick={onClearImport}>
          <Eraser size={16} aria-hidden="true" />
          Clear import
        </button>
        {importMessage && (
          <span className="import-message" role="status">
            {importMessage}
          </span>
        )}
      </div>
    </section>
  );
}
