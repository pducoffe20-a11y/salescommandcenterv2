import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Flame,
  Gauge,
  Mail,
  PhoneCall,
  RadioTower,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type {
  Account,
  Contact,
  EmailDraft,
  Meeting,
  PriorityItem,
  Task,
  Trigger,
} from "../types";
import { formatCurrency } from "../services/generators";

interface CommandCenterProps {
  accounts: Account[];
  contacts: Contact[];
  meetings: Meeting[];
  tasks: Task[];
  triggers: Trigger[];
  emailDrafts: EmailDraft[];
  priorityItems: PriorityItem[];
  onOpenAccount: (accountId: string) => void;
  onOpenPrep: () => void;
  onOpenFollowUp: () => void;
}

export function CommandCenter({
  accounts,
  contacts,
  meetings,
  tasks,
  triggers,
  emailDrafts,
  priorityItems,
  onOpenAccount,
  onOpenPrep,
  onOpenFollowUp,
}: CommandCenterProps) {
  const topPriority = priorityItems[0];
  const topAccount = getAccount(accounts, topPriority.accountId);
  const topContact = getContact(contacts, topPriority.contactId);
  const overdueTasks = tasks.filter((task) => task.status === "Overdue");
  const pipeline = accounts.reduce(
    (total, account) => total + account.arrPotential,
    0,
  );
  const momentumAverage = Math.round(
    accounts.reduce((total, account) => total + account.momentumScore, 0) /
      accounts.length,
  );
  const atRiskAccounts = [...accounts]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);
  const momentumAccounts = [...accounts]
    .sort((a, b) => b.momentumScore - a.momentumScore)
    .slice(0, 3);

  return (
    <div className="page-grid">
      <section className="hero-cockpit" aria-labelledby="today-heading">
        <div className="hero-copy">
          <span className="eyebrow">Today command center</span>
          <h1 id="today-heading">Work the account most likely to move.</h1>
          <p>
            Start with {topAccount.name}. {topPriority.whyItMatters}
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => onOpenAccount(topAccount.id)}
            >
              <PhoneCall size={18} aria-hidden="true" />
              {topPriority.recommendedAction}
            </button>
            <button className="secondary-button" type="button" onClick={onOpenPrep}>
              Prep next meeting
            </button>
          </div>
        </div>
        <div className="momentum-index" aria-label="Momentum index">
          <div className="index-orbit">
            <span>{momentumAverage}</span>
          </div>
          <div>
            <span className="eyebrow">Momentum Index</span>
            <strong>{topAccount.name}</strong>
            <p>Buyer: {topContact?.name ?? "Account team"}</p>
            <p>Next step: {topPriority.softCta}</p>
          </div>
        </div>
      </section>

      <section className="kpi-strip" aria-label="Revenue snapshot">
        <KpiCard
          icon={TrendingUp}
          label="Open potential"
          value={formatCurrency(pipeline)}
          detail="Across active Brightspace plays"
        />
        <KpiCard
          icon={CalendarClock}
          label="Meetings needing prep"
          value={`${meetings.length}`}
          detail="Two today, one tomorrow"
        />
        <KpiCard
          icon={ShieldAlert}
          label="Overdue follow-ups"
          value={`${overdueTasks.length}`}
          detail="Highest risk: Prairie"
        />
        <KpiCard
          icon={RadioTower}
          label="Hot triggers"
          value={`${triggers.length}`}
          detail="Signals ready for outreach"
        />
      </section>

      <section className="panel priority-panel" aria-labelledby="priority-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Priority queue</span>
            <h2 id="priority-heading">What to work on first</h2>
          </div>
          <span className="status-pill">Action ranked</span>
        </div>
        <div className="priority-list">
          {priorityItems.map((item, index) => {
            const account = getAccount(accounts, item.accountId);
            const contact = getContact(contacts, item.contactId);
            return (
              <article className="priority-card" key={item.id}>
                <div className="rank">{index + 1}</div>
                <div className="priority-body">
                  <div className="card-topline">
                    <span>{item.signalType}</span>
                    <strong>{item.urgency}</strong>
                  </div>
                  <h3>{item.title}</h3>
                  <dl className="mini-facts">
                    <div>
                      <dt>Account</dt>
                      <dd>{account.name}</dd>
                    </div>
                    <div>
                      <dt>Buyer</dt>
                      <dd>{contact?.name ?? "Account team"}</dd>
                    </div>
                  </dl>
                  <p>
                    <strong>Why it matters:</strong> {item.whyItMatters}
                  </p>
                  <p>
                    <strong>Recommended action:</strong>{" "}
                    {item.recommendedAction}
                  </p>
                  <div className="card-actions">
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => onOpenAccount(account.id)}
                      aria-label={`Open ${account.name}`}
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                    <span>{item.softCta}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel signal-panel" aria-labelledby="signals-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Live signal feed</span>
            <h2 id="signals-heading">Reasons to reach out</h2>
          </div>
          <RadioTower size={20} aria-hidden="true" />
        </div>
        <div className="signal-list">
          {triggers.map((trigger) => {
            const account = getAccount(accounts, trigger.accountId);
            return (
              <article className="signal-row" key={trigger.id}>
                <span className="pulse-dot" aria-hidden="true" />
                <div>
                  <strong>{trigger.title}</strong>
                  <p>{account.name}</p>
                  <p>{trigger.whyItMatters}</p>
                </div>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => onOpenAccount(account.id)}
                >
                  {trigger.nextAction}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-columns" aria-label="Workstreams">
        <WorkstreamColumn
          icon={CalendarClock}
          title="Meetings needing prep"
          items={meetings.map((meeting) => ({
            id: meeting.id,
            account: getAccount(accounts, meeting.accountId),
            contact: getContact(contacts, meeting.contactId),
            title: meeting.title,
            meta: meeting.time,
            why: meeting.context,
            action: meeting.prepNeed,
            cta: "Generate prep",
            onClick: onOpenPrep,
          }))}
        />
        <WorkstreamColumn
          icon={CheckCircle2}
          title="Overdue follow-ups"
          items={tasks.slice(0, 3).map((task) => ({
            id: task.id,
            account: getAccount(accounts, task.accountId),
            contact: getContact(contacts, task.contactId),
            title: task.title,
            meta: task.due,
            why: task.whyItMatters,
            action: task.nextAction,
            cta: "Build follow-up",
            onClick: onOpenFollowUp,
          }))}
        />
        <WorkstreamColumn
          icon={Mail}
          title="Draft emails"
          items={emailDrafts.map((draft) => ({
            id: draft.id,
            account: getAccount(accounts, draft.accountId),
            contact: getContact(contacts, draft.contactId),
            title: draft.subject,
            meta: "Ready to review",
            why: draft.whyItMatters,
            action: draft.nextAction,
            cta: "Review voice",
            onClick: onOpenFollowUp,
          }))}
        />
      </section>

      <section className="panel risk-panel" aria-labelledby="risk-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Account risk panel</span>
            <h2 id="risk-heading">Do not let these go quiet</h2>
          </div>
          <ShieldAlert size={20} aria-hidden="true" />
        </div>
        <AccountScoreList
          accounts={atRiskAccounts}
          scoreKey="riskScore"
          label="Risk"
          onOpenAccount={onOpenAccount}
        />
      </section>

      <section
        className="panel momentum-panel"
        aria-labelledby="momentum-heading"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">Momentum panel</span>
            <h2 id="momentum-heading">Accounts with movement</h2>
          </div>
          <Flame size={20} aria-hidden="true" />
        </div>
        <AccountScoreList
          accounts={momentumAccounts}
          scoreKey="momentumScore"
          label="Momentum"
          onOpenAccount={onOpenAccount}
        />
      </section>
    </div>
  );
}

interface KpiCardProps {
  icon: typeof Gauge;
  label: string;
  value: string;
  detail: string;
}

function KpiCard({ icon: Icon, label, value, detail }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <Icon size={20} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

interface WorkItem {
  id: string;
  account: Account;
  contact?: Contact;
  title: string;
  meta: string;
  why: string;
  action: string;
  cta: string;
  onClick: () => void;
}

function WorkstreamColumn({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Sparkles;
  title: string;
  items: WorkItem[];
}) {
  return (
    <section className="panel workstream" aria-labelledby={`${title}-heading`}>
      <div className="workstream-title">
        <Icon size={18} aria-hidden="true" />
        <h2 id={`${title}-heading`}>{title}</h2>
      </div>
      {items.map((item) => (
        <article className="work-card" key={item.id}>
          <div className="card-topline">
            <span>{item.meta}</span>
          </div>
          <h3>{item.title}</h3>
          <dl className="mini-facts">
            <div>
              <dt>Account</dt>
              <dd>{item.account.name}</dd>
            </div>
            <div>
              <dt>Buyer</dt>
              <dd>{item.contact?.name ?? "Account team"}</dd>
            </div>
          </dl>
          <p>
            <strong>Why it matters:</strong> {item.why}
          </p>
          <p>
            <strong>Recommended action:</strong> {item.action}
          </p>
          <button className="text-button" type="button" onClick={item.onClick}>
            {item.cta}
          </button>
        </article>
      ))}
    </section>
  );
}

function AccountScoreList({
  accounts,
  scoreKey,
  label,
  onOpenAccount,
}: {
  accounts: Account[];
  scoreKey: "riskScore" | "momentumScore";
  label: string;
  onOpenAccount: (accountId: string) => void;
}) {
  return (
    <div className="score-list">
      {accounts.map((account) => (
        <article className="score-row" key={account.id}>
          <div>
            <strong>{account.name}</strong>
            <p>{account.whyItMatters}</p>
            <span>Next: {account.recommendedAction}</span>
          </div>
          <div className="score-meter">
            <span>{label}</span>
            <strong>{account[scoreKey]}</strong>
            <div className="meter-track">
              <span style={{ width: `${account[scoreKey]}%` }} />
            </div>
            <button
              className="text-button"
              type="button"
              onClick={() => onOpenAccount(account.id)}
            >
              Open
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function getAccount(accounts: Account[], accountId: string): Account {
  return accounts.find((account) => account.id === accountId) ?? accounts[0];
}

function getContact(contacts: Contact[], contactId?: string): Contact | undefined {
  return contacts.find((contact) => contact.id === contactId);
}
