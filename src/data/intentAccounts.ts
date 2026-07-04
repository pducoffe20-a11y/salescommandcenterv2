import type { IntentAccount } from "../workflowData";

export const intentAccounts: IntentAccount[] = [
  {
    name: "Pinnacle Safety Institute",
    evidenceStrength: "Medium",
    repeatedActivity: "Appeared in 2 mock alerts",
    urgencySignal: "Training scale + compliance topics",
    storyMatch: "Compliance training customer story",
    summary:
      "Activity could point to a compliance training review. The evidence is account-level only, so Pat should test whether training governance is actually on the table.",
    rawEvidence: [
      "Mock alert 2026-07-01: compliance training keywords",
      "Mock alert 2026-07-03: learning platform comparison topic",
    ],
    draft:
      "Hi Jordan — I saw Pinnacle is continuing to invest in safety education, and it made me wonder whether training governance is becoming harder as programs grow. We work with teams that need cleaner ways to deliver and report on required learning without making the learner experience heavier. If that is remotely relevant, would it be useful to compare notes for 15 minutes?",
  },
  {
    name: "Civic Credentialing Board",
    evidenceStrength: "High",
    repeatedActivity: "Appeared in 3 mock alerts",
    urgencySignal: "Certification and assessment topics repeated",
    storyMatch: "Credentialing modernization story",
    summary:
      "Repeated credentialing language makes this the strongest mock follow-up candidate, but timing and owner still need validation.",
    rawEvidence: [
      "Mock alert 2026-06-29: certification management",
      "Mock alert 2026-07-02: exam prep content",
      "Mock alert 2026-07-03: learner reporting",
    ],
    draft:
      "Hi Avery — your certification programs look like the kind of education experience where delivery and reporting can get complicated quickly. If your team is looking at ways to simplify that experience this year, I’d be glad to share what similar credentialing groups tend to evaluate first. Open to a quick fit check next week?",
  },
  {
    name: "Greenfield Employers Council",
    evidenceStrength: "Thin",
    repeatedActivity: "Single mock alert",
    urgencySignal: "Broad workforce learning topic",
    storyMatch: null,
    summary:
      "The signal is too broad to treat as urgency. Keep the note exploratory and avoid a customer story.",
    rawEvidence: ["Mock alert 2026-07-02: workforce development topic only"],
    draft:
      "Hi Sam — I noticed Greenfield’s work sits close to workforce education, and I had a simple question. Are you looking at member or employer training programs this year, or is that not a current focus? If it is on the radar, I’d be happy to compare notes.",
  },
];
