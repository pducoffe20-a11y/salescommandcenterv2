Sales Command Center V2

Mission

Sales Command Center V2 is the home for my agentic sales workflows built in ChatGPT and Codex.

The goal is not to replace my CRM or Outlook. It is to become my AI operating system for B2B selling—bringing research, prospecting, meeting preparation, deal strategy, execution, and follow-up into one connected workspace.

Every workflow should help me spend less time organizing information and more time having meaningful conversations with customers.

⸻

Design Philosophy

Everything in the application should follow these principles.

Evidence First

Never invent information.

Always separate:

* Verified facts
* Reasonable inference
* Unknowns
* Research gaps

Evidence should always be more important than confidence.

⸻

Seller First

Every screen should answer:

“What should I do next?”

Not:

“Here’s more information.”

Every workflow should finish with practical seller actions.

⸻

Human Review

Nothing is considered final until reviewed.

The application prepares work.

It never autonomously:

* sends email
* updates CRM
* changes account strategy
* creates fake certainty

⸻

Modular

Every workflow should be independent while sharing common data.

Each module can be launched individually or chained into larger workflows.

⸻

Overall Product Vision

Think of this application as:

Mission Control for Outbound Judgment.

Not a CRM.

Not another dashboard.

Not another note-taking app.

Instead, it is an AI workspace that continuously helps answer:

* Who should I work?
* Why now?
* What evidence supports that?
* What should I say?
* What meeting am I preparing for?
* What happened after the meeting?
* Where is risk developing?
* What should happen next?

⸻

Primary Workflows

1. Brightspace New-Logo Prospecting Hub

Purpose

Identify the highest-value net-new accounts.

Supports:

* territory planning
* ICP prioritization
* account ranking
* Brightspace use-case mapping
* research gaps
* account briefs
* seller worklists

Outputs

* ranked worklists
* account briefs
* seller action plans
* outreach recommendations

⸻

2. Prospect Strategy Engine

Purpose

Convert raw prospect lists into structured seller strategy.

Supports:

* normalization
* enrichment
* evidence review
* scoring
* prioritization
* outreach preparation

Outputs

* outreach_preparation_payloads.json
* board_summary.json
* sequencing plans
* review-ready outreach inputs

⸻

3. Seller Execution Dashboard

Purpose

Turn strategy into execution.

Supports:

* Work Now board
* Light Research queue
* Suppress queue
* seller progress tracking
* copy-ready outreach
* HTML dashboard generation

Outputs

* dashboard.html
* execution boards
* progress tracking

⸻

4. Pre-Call Briefing Studio

Purpose

Prepare for customer meetings.

Generates:

* Account Snapshot
* Contact Angle
* D2L Value Angles
* Discovery Questions
* Likely Objections
* Opener + Next Step Ask

Supports future integration with:

* Outlook Calendar
* Outlook Email
* Zoom

⸻

5. Deal Intelligence Studio

Purpose

Understand opportunity health.

Supports:

* MEDDIC review
* stakeholder coverage
* buying signals
* deal momentum
* evidence gaps
* next-step recommendations

Outputs

* executive dashboard
* meeting brief
* execution package
* deal review

⸻

6. Intent Alert Follow-Up Studio

Purpose

Convert recent intent alerts into seller action.

Supports:

* Outlook intent alerts
* account summaries
* customer story matching
* Pat-style outreach drafts

Never references:

* intent monitoring
* tracking
* anonymous visitors
* surveillance

⸻

7. Agent Inbox

Purpose

Receive generated work from every workflow.

Future artifacts include:

* meeting briefs
* account briefs
* research
* outreach drafts
* follow-ups
* deal reviews
* tasks
* triggers

Everything stays here until reviewed.

⸻

Future Workflow Modules

The architecture should easily support additional workflows.

Examples:

* Daily Brief
* Weekly Planning
* Mutual Action Plans
* Executive Business Cases
* Competitive Battlecards
* Proposal Builder
* Customer Story Library
* RFP Assistant
* Territory Analytics
* Forecast Review
* Renewal Strategy
* Expansion Strategy

⸻

Shared Design System

Every module should use the same visual language.

Style

* Premium SaaS
* Dark executive workspace
* High trust
* Calm
* Dense but readable
* Minimal decoration
* Fast scanning

⸻

Shared Components

* Workflow cards
* Evidence cards
* Status badges
* JSON viewer
* Timeline
* Activity feed
* KPI strip
* Progress tracker
* Drawer panels
* Detail cards
* Export panels
* Toast notifications
* Copy buttons
* Source indicators

⸻

Source Hierarchy

Always prioritize information in this order:

1. User-provided information
2. Uploaded files
3. Connected Microsoft sources
4. Connected collaboration tools
5. Public web research
6. Commercial inference

Never reverse this order without good reason.

⸻

Planned Integrations

Microsoft

* Outlook Email
* Outlook Calendar
* SharePoint
* Teams

Meetings

* Zoom

Internal

* Slack

Research

* Web search

Future

* Salesforce
* Gong
* Apollo
* Sales Navigator
* 6sense
* ZoomInfo

⸻

Data Rules

Always distinguish between:

Verified Facts

Information supported directly by evidence.

Inference

Reasonable interpretation.

Unknown

Information not available.

Research Gap

Information that would improve confidence.

Nothing should blur these categories.

⸻

Workflow Principles

Every workflow should produce:

1. Recommendation
2. Supporting evidence
3. Risks
4. Unknowns
5. Next actions

Not the other way around.

⸻

UI Principles

Every screen should answer:

* Where am I?
* What matters?
* What should I do next?

Avoid unnecessary clicks.

Keep interactions fast.

Keep navigation obvious.

Avoid modal overload.

Prioritize keyboard-friendly workflows.

⸻

AI Principles

The AI should behave like an experienced sales strategist.

It should:

* prioritize
* simplify
* explain
* challenge assumptions
* recommend next steps

It should not:

* fabricate evidence
* exaggerate certainty
* sound like marketing
* create unnecessary work

⸻

Version One Goals

Version 1 is a working prototype.

Use realistic mock data.

Build the complete workflow architecture.

Leave clean integration points for:

* Microsoft Graph
* CRM
* D2L internal systems
* External research
* Future agent orchestration

Do not build those integrations yet.

⸻

Success Criteria

Sales Command Center succeeds when it helps answer one question faster than any CRM:

“Given everything I know right now, what is the best next action I should take?”
