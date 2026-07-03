import {
  Archive,
  Check,
  Download,
  FilePlus2,
  GitMerge,
  MailPlus,
  PlusCircle,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

interface AgentArtifact {
  id: string;
  account: string;
  type: "Research note" | "Buying signal" | "Contact update" | "Email insight";
  title: string;
  summary: string;
  sourceAgent: string;
  confidence: "High" | "Medium" | "Needs review";
  createdAt: string;
  recommendedDestination: string;
}

const importedArtifacts: AgentArtifact[] = [
  {
    id: "artifact-northstar-1",
    account: "Northstar State University",
    type: "Research note",
    title: "Retention initiative now tied to advising workflow",
    summary:
      "Agent found a provost update naming coordinated early alerts as a measurable goal for the coming academic year.",
    sourceAgent: "Research scout",
    confidence: "High",
    createdAt: "2026-07-03T09:12:00Z",
    recommendedDestination: "Merge into account intelligence",
  },
  {
    id: "artifact-northstar-2",
    account: "Northstar State University",
    type: "Email insight",
    title: "Mira responded positively to retention language",
    summary:
      "Thread summary suggests the next draft should anchor on one gateway course workflow and avoid a broad platform overview.",
    sourceAgent: "Inbox summarizer",
    confidence: "Medium",
    createdAt: "2026-07-02T16:40:00Z",
    recommendedDestination: "Create email draft",
  },
  {
    id: "artifact-evergreen-1",
    account: "Evergreen Online Academy",
    type: "Buying signal",
    title: "New VP of Programs announced CTE pathway expansion",
    summary:
      "Imported web artifact indicates CTE rollout ownership may have changed, creating a timely re-entry point.",
    sourceAgent: "Signal monitor",
    confidence: "High",
    createdAt: "2026-07-03T07:48:00Z",
    recommendedDestination: "Create trigger",
  },
  {
    id: "artifact-prairie-1",
    account: "Prairie Technical Institute",
    type: "Contact update",
    title: "CIO joined vendor review committee",
    summary:
      "Agent inferred the CIO is now directly involved in spend review; artifact needs rep validation before being merged.",
    sourceAgent: "CRM hygiene bot",
    confidence: "Needs review",
    createdAt: "2026-07-01T13:18:00Z",
    recommendedDestination: "Create task",
  },
  {
    id: "artifact-summit-1",
    account: "Summit Career College",
    type: "Research note",
    title: "Finance asked for migration risk assumptions",
    summary:
      "Call-note import highlights open questions around SIS capacity, launch sequencing, and support ownership.",
    sourceAgent: "Meeting miner",
    confidence: "Medium",
    createdAt: "2026-06-30T21:05:00Z",
    recommendedDestination: "Merge into account intelligence",
  },
];

const workflowActions = [
  { label: "Accept", icon: Check },
  { label: "Reject", icon: X },
  { label: "Merge into account", icon: GitMerge },
  { label: "Create task", icon: PlusCircle },
  { label: "Create trigger", icon: Sparkles },
  { label: "Create email draft", icon: MailPlus },
  { label: "Export", icon: Download },
];

export function AgentInbox() {
  const groupedArtifacts = importedArtifacts.reduce<Record<string, AgentArtifact[]>>(
    (groups, artifact) => {
      groups[artifact.account] = [...(groups[artifact.account] ?? []), artifact];
      return groups;
    },
    {},
  );

  return (
    <div className="agent-inbox-page">
      <section className="tool-header agent-inbox-hero" aria-labelledby="agent-inbox-heading">
        <div>
          <span className="eyebrow">Agent inbox</span>
          <h1 id="agent-inbox-heading">Review imported agent artifacts before they touch CRM truth.</h1>
          <p>
            Seeded artifacts model the future intake queue: inspect confidence, group by account,
            and decide whether each item should become account intelligence, a task, a trigger, an
            email draft, or an export.
          </p>
        </div>
      </section>

      <section className="kpi-strip" aria-label="Agent artifact summary">
        <InboxStat label="Imported artifacts" value={importedArtifacts.length.toString()} detail="Mock queue ready for design" />
        <InboxStat label="Accounts represented" value={Object.keys(groupedArtifacts).length.toString()} detail="Grouped account worklists" />
        <InboxStat label="High confidence" value={importedArtifacts.filter((artifact) => artifact.confidence === "High").length.toString()} detail="Candidates for quick accept" />
        <InboxStat label="Needs review" value={importedArtifacts.filter((artifact) => artifact.confidence === "Needs review").length.toString()} detail="Requires rep validation" />
      </section>

      <section className="panel agent-toolbar" aria-label="Future workflow actions">
        <div>
          <span className="eyebrow">Workflow affordances</span>
          <h2>Bulk and item actions</h2>
        </div>
        <div className="agent-action-row">
          {workflowActions.map(({ label, icon: Icon }) => (
            <button className="secondary-button" type="button" key={label}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="agent-account-stack">
        {Object.entries(groupedArtifacts).map(([account, artifacts]) => (
          <section className="panel agent-account-group" key={account} aria-labelledby={`${account}-heading`}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">Account group</span>
                <h2 id={`${account}-heading`}>{account}</h2>
              </div>
              <span className="status-pill">{artifacts.length} artifacts</span>
            </div>

            <div className="agent-artifact-grid">
              {artifacts.map((artifact) => (
                <article className="agent-artifact-card" key={artifact.id}>
                  <div className="card-topline">
                    <span>{artifact.type}</span>
                    <strong>{artifact.confidence}</strong>
                  </div>
                  <h3>{artifact.title}</h3>
                  <p>{artifact.summary}</p>
                  <dl className="mini-facts artifact-facts">
                    <div>
                      <dt>Created</dt>
                      <dd>{formatCreatedDate(artifact.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Agent</dt>
                      <dd>{artifact.sourceAgent}</dd>
                    </div>
                    <div>
                      <dt>Recommended action</dt>
                      <dd>{artifact.recommendedDestination}</dd>
                    </div>
                    <div>
                      <dt>Confidence</dt>
                      <dd>{artifact.confidence}</dd>
                    </div>
                  </dl>
                  <div className="card-actions">
                    <button className="primary-button" type="button">
                      <Check size={16} aria-hidden="true" />
                      Accept
                    </button>
                    <button className="text-button" type="button">
                      <SlidersHorizontal size={16} aria-hidden="true" />
                      Triage
                    </button>
                    <button className="icon-button" type="button" aria-label={`Export ${artifact.title}`}>
                      <Archive size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function InboxStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="kpi-card">
      <FilePlus2 size={22} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function formatCreatedDate(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
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
