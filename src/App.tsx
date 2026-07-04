import { useCallback, useEffect, useRef, useState } from "react";
import { AgentInbox } from "./components/AgentInbox";
import { DealsView, ExportsView, HomeView, IntentView, PreCallView, ProspectingView, SettingsView, StrategyView } from "./components/workflow/WorkflowViews";
import { WorkflowStateProvider, useWorkflowState } from "./context/WorkflowStateContext";
import { buildUrl, getRouteState, navItems, type View } from "./router/appRouter";

export function App() {
  const [routeState, setRouteState] = useState(getRouteState);

  const navigate = useCallback((nextView: View, nextParams = new URLSearchParams()) => {
    window.history.pushState(null, "", buildUrl(nextView, nextParams));
    setRouteState(getRouteState());
  }, []);

  useEffect(() => {
    const syncRoute = () => setRouteState(getRouteState());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  return <WorkflowStateProvider navigate={navigate}>
    <AppShell routeState={routeState} navigate={navigate} />
  </WorkflowStateProvider>;
}

function AppShell({ routeState, navigate }: { routeState: ReturnType<typeof getRouteState>; navigate: (view: View, params?: URLSearchParams) => void }) {
  const { view, params } = routeState;
  const { syncSelectionsFromParams, paramsForView } = useWorkflowState();
  const [toast, setToast] = useState("");
  const toastTimeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    syncSelectionsFromParams(params);
  }, [params, syncSelectionsFromParams]);

  const launchView = useCallback((nextView: View) => navigate(nextView, paramsForView(nextView)), [navigate, paramsForView]);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToast(""), 1800);
  }, []);

  const copy = useCallback((text: string, label = "Copied") => {
    void navigator.clipboard?.writeText(text);
    notify(label);
  }, [notify]);

  return <div className="app-shell workflow-shell">
    <div className="texture-grid" aria-hidden="true" />
    <aside className="sidebar">
      <button className="brand brand-button" onClick={() => launchView("home")}>
        <span className="brand-mark">OW</span><span><strong>Outbound Workflow</strong><small>Command Center</small></span>
      </button>
      <nav className="nav-stack" aria-label="Workflow navigation">
        {navItems.map(([id, label, Icon]) => <button key={id} className={`nav-item ${view === id ? "active" : ""}`} onClick={() => launchView(id)}><Icon size={18}/><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-card"><span className="eyebrow">Evidence rule</span><strong>Facts stay separate from inference.</strong><p>Mock data only. All drafts require human review before use.</p></div>
    </aside>
    <main className="main-stage">
      <WorkflowRoute view={view} copy={copy} launchView={launchView} />
    </main>
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}

function WorkflowRoute({ view, copy, launchView }: { view: View; copy: (text: string, label?: string) => void; launchView: (view: View) => void }) {
  const { commandCenterData, setCommandCenterData, selectedAccount, selectedProspect, selectedIntent, dealIndex, selectAccount, selectProspect, selectDeal, selectIntent } = useWorkflowState();

  if (view === "home") return <HomeView onLaunch={launchView} commandCenterData={commandCenterData} />;
  if (view === "prospecting") return <ProspectingView selected={selectedAccount} onSelect={selectAccount} copy={copy} commandCenterData={commandCenterData} />;
  if (view === "prospects") return <StrategyView selected={selectedProspect} onSelect={selectProspect} copy={copy} />;
  if (view === "precall") return <PreCallView copy={copy} />;
  if (view === "deals") return <DealsView dealIndex={dealIndex} setDealIndex={selectDeal} copy={copy} commandCenterData={commandCenterData} />;
  if (view === "intent") return <IntentView selected={selectedIntent} onSelect={selectIntent} copy={copy} commandCenterData={commandCenterData} />;
  if (view === "agent-inbox") return <AgentInbox promotedData={commandCenterData} onPromotedDataChange={setCommandCenterData} />;
  if (view === "exports") return <ExportsView copy={copy} />;
  return <SettingsView />;
}
