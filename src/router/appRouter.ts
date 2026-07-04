import { Home, Settings, Search, Users, FileText, BriefcaseBusiness, RadioTower, Inbox, Download, type LucideIcon } from "lucide-react";
import { workflowIds, type WorkflowId } from "../types/workflow";

export type View = "home" | WorkflowId | "agent-inbox";

export const routeByView: Record<View, string> = {
  home: "/",
  settings: "/sources",
  prospecting: "/prospecting",
  prospects: "/strategy",
  precall: "/pre-call",
  deals: "/deals",
  intent: "/intent",
  "agent-inbox": "/agent-inbox",
  exports: "/exports",
};

const viewByRoute = Object.fromEntries(Object.entries(routeByView).map(([view, route]) => [route, view])) as Record<string, View>;

export const navItems: Array<readonly [View, string, LucideIcon]> = [
  ["home", "Home", Home],
  ["settings", "Sources", Settings],
  ["prospecting", "Prospecting", Search],
  ["prospects", "Strategy", Users],
  ["precall", "Pre-call", FileText],
  ["deals", "Deals", BriefcaseBusiness],
  ["intent", "Intent", RadioTower],
  ["agent-inbox", "Agent Inbox", Inbox],
  ["exports", "Exports", Download],
];

export function isWorkflowId(view: View): view is WorkflowId {
  return (workflowIds as readonly string[]).includes(view);
}

export function getRouteState() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return { view: viewByRoute[path] ?? "home", params: new URLSearchParams(window.location.search) };
}

export function buildUrl(view: View, params = new URLSearchParams()) {
  const query = params.toString();
  return `${routeByView[view]}${query ? `?${query}` : ""}`;
}
