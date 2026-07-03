import {
  ArrowRight,
  CalendarDays,
  CircleDot,
  FileText,
  MailCheck,
  Network,
  Phone,
  Shield,
  Target,
  Users,
} from "lucide-react";
import type {
  Account,
  Competitor,
  Contact,
  Meeting,
  OpportunityNote,
  Task,
  TimelineEvent,
} from "../types";
import { formatCurrency } from "../services/generators";

interface AccountWorkspaceProps {
  accounts: Account[];
  contacts: Contact[];
  meetings: Meeting[];
  tasks: Task[];
  notes: OpportunityNote[];
  competitors: Competitor[];
  timelineEvents: TimelineEvent[];
  selectedAccount: Account;
  onSelectAccount: (accountId: string) => void;
  onOpenPrep: () => void;
  onOpenFollowUp: () => void;
}

export function AccountWorkspace({
  accounts,
  contacts,
  meetings,
  tasks,
  notes,
  competitors,
  timelineEvents,
  selectedAccount,
  onSelectAccount,
  onOpenPrep,
  onOpenFollowUp,
}: AccountWorkspaceProps) {
  const accountContacts = contacts.filter(
    (contact) => contact.accountId === selectedAccount.id,
  );
  const accountMeetings = meetings.filter(
    (meeting) => meeting.accountId === selectedAccount.id,
  );
  const accountTasks = tasks.filter((task) => task.accountId === selectedAccount.id);
  const accountNotes = notes.filter((note) => note.accountId === selectedAccount.id);
  const accountCompetitors = competitors.filter(
    (competitor) => competitor.accountId === selectedAccount.id,
  );
  const accountTimeline = timelineEvents.filter(
    (event) => event.accountId === selectedAccount.id,
  );

  return (
    <div className="account-layout">
      <section className="panel account-rail" aria-labelledby="account-list-heading">
        <span className="eyebrow">Account workspace</span>
        <h1 id="account-list-heading">Open account</h1>
        <div className="account-tabs" role="list">
          {accounts.map((account) => (
            <button
              key={account.id}
              className={`account-tab ${
                selectedAccount.id === account.id ? "active" : ""
              }`}
              type="button"
              onClick={() => onSelectAccount(account.id)}
            >
              <span>{account.name}</span>
              <small>{account.stage}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="account-detail" aria-labelledby="account-heading">
        <div className="account-hero panel">
          <div>
            <span className="eyebrow">{selectedAccount.segment} account</span>
            <h2 id="account-heading">{selectedAccount.name}</h2>
            <p>{selectedAccount.snapshot}</p>
          </div>
          <div className="hero-stat-grid">
            <ScoreTile label="Fit" value={selectedAccount.fitScore} />
            <ScoreTile label="Timing" value={selectedAccount.timingScore} />
            <ScoreTile
              label="Relationship"
              value={relationshipValue(selectedAccount.relationshipStatus)}
              text={selectedAccount.relationshipStatus}
            />
            <ScoreTile label="Risk" value={selectedAccount.riskScore} />
          </div>
        </div>

        <div className="account-actions panel">
          <div>
            <span className="eyebrow">Recommended next action</span>
            <h3>{selectedAccount.recommendedAction}</h3>
            <p>
              <strong>Why it matters:</strong> {selectedAccount.whyItMatters}
            </p>
          </div>
          <div className="button-row">
            <button className="primary-button" type="button" onClick={onOpenPrep}>
              <FileText size={18} aria-hidden="true" />
              Prep call
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={onOpenFollowUp}
            >
              <MailCheck size={18} aria-hidden="true" />
              Build follow-up
            </button>
          </div>
        </div>

        <div className="detail-grid">
          <InfoPanel
            icon={Target}
            title="Known pain"
            items={selectedAccount.knownPain}
          />
          <InfoPanel
            icon={Shield}
            title="Research gaps"
            items={selectedAccount.researchGaps}
          />
          <section className="panel detail-panel">
            <div className="workstream-title">
              <Users size={18} aria-hidden="true" />
              <h3>Contacts and committee</h3>
            </div>
            <div className="contact-list">
              {accountContacts.map((contact) => (
                <article className="contact-card" key={contact.id}>
                  <div>
                    <strong>{contact.name}</strong>
                    <span>{contact.role}</span>
                  </div>
                  <p>{contact.angle}</p>
                  <dl className="mini-facts">
                    <div>
                      <dt>Influence</dt>
                      <dd>{contact.influence}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{contact.relationship}</dd>
                    </div>
                    <div>
                      <dt>Last touch</dt>
                      <dd>{contact.lastTouch}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section className="panel detail-panel">
            <div className="workstream-title">
              <CalendarDays size={18} aria-hidden="true" />
              <h3>Tasks and meetings</h3>
            </div>
            <div className="stack-list">
              {accountTasks.map((task) => (
                <article className="compact-item" key={task.id}>
                  <strong>{task.title}</strong>
                  <span>{task.due}</span>
                  <p>{task.nextAction}</p>
                </article>
              ))}
              {accountMeetings.map((meeting) => (
                <article className="compact-item" key={meeting.id}>
                  <strong>{meeting.title}</strong>
                  <span>{meeting.time}</span>
                  <p>{meeting.goal}</p>
                </article>
              ))}
              {!accountTasks.length && !accountMeetings.length && (
                <article className="compact-item">
                  <strong>Next account touch</strong>
                  <span>This week</span>
                  <p>{selectedAccount.softCta}</p>
                </article>
              )}
            </div>
          </section>

          <section className="panel detail-panel">
            <div className="workstream-title">
              <Network size={18} aria-hidden="true" />
              <h3>Competitors</h3>
            </div>
            <div className="stack-list">
              {(accountCompetitors.length
                ? accountCompetitors
                : [
                    {
                      id: "none",
                      name: "No active competitor named",
                      footprint:
                        "Research peer LMS decisions before the next outreach.",
                      wedge:
                        "Keep the conversation on the buyer's stated workflow and timing.",
                    },
                  ]
              ).map((competitor) => (
                <article className="compact-item" key={competitor.id}>
                  <strong>{competitor.name}</strong>
                  <span>{competitor.footprint}</span>
                  <p>{competitor.wedge}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel detail-panel">
            <div className="workstream-title">
              <Phone size={18} aria-hidden="true" />
              <h3>Opportunity notes</h3>
            </div>
            <div className="stack-list">
              {(accountNotes.length
                ? accountNotes
                : [
                    {
                      id: "note-fallback",
                      date: "Today",
                      author: "Command Center",
                      note: selectedAccount.whyItMatters,
                    },
                  ]
              ).map((note) => (
                <article className="compact-item" key={note.id}>
                  <strong>
                    {note.author} · {note.date}
                  </strong>
                  <p>{note.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel detail-panel timeline-panel">
            <div className="workstream-title">
              <CircleDot size={18} aria-hidden="true" />
              <h3>Timeline</h3>
            </div>
            <ol className="timeline">
              {(accountTimeline.length
                ? accountTimeline
                : [
                    {
                      id: "timeline-fallback",
                      date: "Today",
                      title: selectedAccount.stage,
                      detail: selectedAccount.recommendedAction,
                      type: "Task" as const,
                    },
                  ]
              ).map((event) => (
                <li key={event.id}>
                  <span>{event.date}</span>
                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="panel account-summary-band">
          <div>
            <span className="eyebrow">Snapshot</span>
            <strong>{formatCurrency(selectedAccount.arrPotential)}</strong>
            <p>{selectedAccount.stage}</p>
          </div>
          <div>
            <span className="eyebrow">Soft next step</span>
            <strong>{selectedAccount.softCta}</strong>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Move to meeting prep"
            onClick={onOpenPrep}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      </section>
    </div>
  );
}

function ScoreTile({
  label,
  value,
  text,
}: {
  label: string;
  value: number;
  text?: string;
}) {
  return (
    <article className="score-tile">
      <span>{label}</span>
      <strong>{text ?? value}</strong>
      <div className="meter-track" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
    </article>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Target;
  title: string;
  items: string[];
}) {
  return (
    <section className="panel detail-panel">
      <div className="workstream-title">
        <Icon size={18} aria-hidden="true" />
        <h3>{title}</h3>
      </div>
      <ul className="check-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function relationshipValue(status: Account["relationshipStatus"]) {
  switch (status) {
    case "Active":
      return 88;
    case "Warm":
      return 72;
    case "Quiet":
      return 46;
    case "At Risk":
      return 24;
  }
}
