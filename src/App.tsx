import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  Flame,
  MailCheck,
  Mic2,
  Radar,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AccountWorkspace } from "./components/AccountWorkspace";
import { CommandCenter } from "./components/CommandCenter";
import {
  FollowUpPage,
  MeetingPrepPage,
  PreCallBriefPage,
  VoiceReviewPage,
} from "./components/Generators";
import { ProspectWorkspace } from "./components/ProspectWorkspace";
import { salesData } from "./services/agentImports";

type AppView =
  | "today"
  | "account"
  | "meeting"
  | "brief"
  | "followup"
  | "voice"
  | "prospects";

const navItems = [
  { id: "today", label: "Today", icon: Radar },
  { id: "account", label: "Accounts", icon: BriefcaseBusiness },
  { id: "meeting", label: "Meeting Prep", icon: Mic2 },
  { id: "brief", label: "Brief", icon: FileText },
  { id: "followup", label: "Follow-Up", icon: MailCheck },
  { id: "voice", label: "Pat Voice", icon: Sparkles },
  { id: "prospects", label: "Prospects", icon: Users },
] satisfies Array<{ id: AppView; label: string; icon: typeof BarChart3 }>;

export function App() {
  const [activeView, setActiveView] = useState<AppView>("today");
  const {
    accounts,
    contacts,
    meetings,
    tasks,
    triggers,
    emailDrafts,
    priorityItems,
    opportunityNotes,
    competitors,
    timelineEvents,
  } = salesData;
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);

  const selectedAccount = useMemo(
    () =>
      accounts.find((account) => account.id === selectedAccountId) ??
      accounts[0],
    [selectedAccountId],
  );

  function openAccount(accountId: string) {
    setSelectedAccountId(accountId);
    setActiveView("account");
  }

  return (
    <div className="app-shell">
      <div className="texture-grid" aria-hidden="true" />
      <aside className="sidebar" aria-label="Primary navigation">
        <a className="brand" href="#main-content" aria-label="Skip to content">
          <span className="brand-mark">SC</span>
          <span>
            <strong>Sales Command</strong>
            <small>Version 2</small>
          </span>
        </a>
        <nav className="nav-stack">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activeView === id ? "active" : ""}`}
              type="button"
              onClick={() => setActiveView(id)}
              aria-current={activeView === id ? "page" : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <span className="eyebrow">Next best action</span>
          <strong>{priorityItems[0].title}</strong>
          <p>{priorityItems[0].recommendedAction}</p>
          <button
            className="text-button"
            type="button"
            onClick={() => openAccount(priorityItems[0].accountId)}
          >
            Open account
          </button>
        </div>
      </aside>

      <main className="main-stage" id="main-content">
        {activeView === "today" && (
          <CommandCenter
            accounts={accounts}
            contacts={contacts}
            meetings={meetings}
            tasks={tasks}
            triggers={triggers}
            emailDrafts={emailDrafts}
            priorityItems={priorityItems}
            onOpenAccount={openAccount}
            onOpenPrep={() => setActiveView("meeting")}
            onOpenFollowUp={() => setActiveView("followup")}
          />
        )}

        {activeView === "account" && (
          <AccountWorkspace
            accounts={accounts}
            contacts={contacts}
            meetings={meetings}
            tasks={tasks}
            notes={opportunityNotes}
            competitors={competitors}
            timelineEvents={timelineEvents}
            selectedAccount={selectedAccount}
            onSelectAccount={setSelectedAccountId}
            onOpenPrep={() => setActiveView("meeting")}
            onOpenFollowUp={() => setActiveView("followup")}
          />
        )}

        {activeView === "meeting" && (
          <MeetingPrepPage accounts={accounts} contacts={contacts} />
        )}

        {activeView === "brief" && (
          <PreCallBriefPage accounts={accounts} contacts={contacts} />
        )}

        {activeView === "followup" && (
          <FollowUpPage accounts={accounts} contacts={contacts} />
        )}

        {activeView === "voice" && <VoiceReviewPage />}

        {activeView === "prospects" && <ProspectWorkspace />}
      </main>
    </div>
  );
}
