import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { dealReviews, intentAccounts, strategyRecords, territoryAccounts, type IntentAccount, type StrategyRecord, type TerritoryAccount } from "../workflowData";
import { loadPromotedSalesData, type NormalizedSalesData } from "../services/agentImports";
import { getRouteState, type View } from "../router/appRouter";

type Navigate = (view: View, params?: URLSearchParams) => void;

interface WorkflowStateValue {
  commandCenterData: NormalizedSalesData;
  setCommandCenterData: (data: NormalizedSalesData) => void;
  selectedAccount: TerritoryAccount;
  selectedProspect: StrategyRecord;
  selectedIntent: IntentAccount;
  dealIndex: number;
  selectAccount: (account: TerritoryAccount) => void;
  selectProspect: (prospect: StrategyRecord) => void;
  selectIntent: (account: IntentAccount) => void;
  selectDeal: (index: number) => void;
  paramsForView: (view: View) => URLSearchParams;
  syncSelectionsFromParams: (params: URLSearchParams) => void;
}

const WorkflowStateContext = createContext<WorkflowStateValue | null>(null);

export function WorkflowStateProvider({ children, navigate }: { children: ReactNode; navigate: Navigate }) {
  const initialParams = getRouteState().params;
  const [commandCenterData, setCommandCenterData] = useState<NormalizedSalesData>(() => loadPromotedSalesData());
  const [selectedAccount, setSelectedAccount] = useState(() => territoryAccounts.find((account) => account.account_id === initialParams.get("account")) ?? territoryAccounts[0]);
  const [selectedProspect, setSelectedProspect] = useState(() => strategyRecords.find((prospect) => prospect.prospect_id === initialParams.get("prospect")) ?? strategyRecords[0]);
  const [selectedIntent, setSelectedIntent] = useState(() => intentAccounts.find((account) => account.name === initialParams.get("intent")) ?? intentAccounts[0]);
  const [dealIndex, setDealIndex] = useState(() => {
    const index = Number(initialParams.get("deal"));
    return Number.isInteger(index) && dealReviews[index] ? index : 0;
  });

  const syncSelectionsFromParams = useCallback((params: URLSearchParams) => {
    const account = territoryAccounts.find((item) => item.account_id === params.get("account"));
    if (account) setSelectedAccount(account);
    const prospect = strategyRecords.find((item) => item.prospect_id === params.get("prospect"));
    if (prospect) setSelectedProspect(prospect);
    const intentAccount = intentAccounts.find((item) => item.name === params.get("intent"));
    if (intentAccount) setSelectedIntent(intentAccount);
    const nextDealIndex = Number(params.get("deal"));
    if (Number.isInteger(nextDealIndex) && dealReviews[nextDealIndex]) setDealIndex(nextDealIndex);
  }, []);

  const selectAccount = useCallback((account: TerritoryAccount) => { setSelectedAccount(account); const params = new URLSearchParams(); params.set("account", account.account_id); navigate("prospecting", params); }, [navigate]);
  const selectProspect = useCallback((prospect: StrategyRecord) => { setSelectedProspect(prospect); const params = new URLSearchParams(); params.set("prospect", prospect.prospect_id); navigate("prospects", params); }, [navigate]);
  const selectIntent = useCallback((account: IntentAccount) => { setSelectedIntent(account); const params = new URLSearchParams(); params.set("intent", account.name); navigate("intent", params); }, [navigate]);
  const selectDeal = useCallback((index: number) => { setDealIndex(index); const params = new URLSearchParams(); params.set("deal", String(index)); navigate("deals", params); }, [navigate]);

  const paramsForView = useCallback((view: View) => {
    const params = new URLSearchParams();
    if (view === "prospecting") params.set("account", selectedAccount.account_id);
    if (view === "prospects") params.set("prospect", selectedProspect.prospect_id);
    if (view === "deals") params.set("deal", String(dealIndex));
    if (view === "intent") params.set("intent", selectedIntent.name);
    return params;
  }, [dealIndex, selectedAccount.account_id, selectedIntent.name, selectedProspect.prospect_id]);

  const value = useMemo(() => ({ commandCenterData, setCommandCenterData, selectedAccount, selectedProspect, selectedIntent, dealIndex, selectAccount, selectProspect, selectIntent, selectDeal, paramsForView, syncSelectionsFromParams }), [commandCenterData, selectedAccount, selectedProspect, selectedIntent, dealIndex, selectAccount, selectProspect, selectIntent, selectDeal, paramsForView, syncSelectionsFromParams]);
  return <WorkflowStateContext.Provider value={value}>{children}</WorkflowStateContext.Provider>;
}

export function useWorkflowState() {
  const context = useContext(WorkflowStateContext);
  if (!context) throw new Error("useWorkflowState must be used within WorkflowStateProvider");
  return context;
}
