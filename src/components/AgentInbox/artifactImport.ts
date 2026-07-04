import type { AgentArtifact, AgentArtifactKind, AgentArtifactStatus, JsonValue } from "../../types";
import type { ArtifactImportInput, CleanArtifactInput, ImportPreviewRow } from "./types";

export const validKinds: AgentArtifactKind[] = [
  "Meeting prep",
  "Follow-up",
  "Pre-call brief",
  "Voice review",
  "Research note",
];

export const validStatuses: AgentArtifactStatus[] = ["Imported", "Promoted", "Archived", "Rejected"];

export const sampleArtifactImport = JSON.stringify(
  [
    {
      kind: "Research note",
      status: "Imported",
      title: "Imported enrollment signal",
      body: "New agent note: validate the enrollment initiative before outreach.",
      source: "Clean JSON import",
      payload: {
        accounts: [
          {
            accountId: "brightpath",
            accountName: "Brightpath Learning Council",
            stage: "Imported signal",
            fitScore: 84,
            timingScore: 78,
            snapshot: "Imported enrollment initiative signal.",
            recommendedAction: "Validate whether enrollment reporting is a current priority.",
            triggers: [
              {
                title: "Enrollment initiative signal",
                source: "Agent import",
                whyItMatters: "Could indicate near-term learner experience work.",
                nextAction: "Ask who owns enrollment reporting and learner engagement.",
              },
            ],
            actionItems: [
              {
                accountId: "brightpath",
                title: "Validate enrollment reporting priority",
                priority: "High",
                status: "This Week",
              },
            ],
            emailDrafts: [
              {
                accountId: "brightpath",
                subject: "Enrollment reporting question",
                body: "Hi — I saw a note that enrollment reporting may be getting attention. Is improving learner visibility a current priority, or should I not read too much into that?",
              },
            ],
          },
        ],
      },
    },
  ],
  null,
  2,
);

type JsonRecord = Record<string, unknown>;
type CsvRecord = Record<string, string>;

export function parseArtifactImport(rawImport: string, sourceName = "Pasted import"): ImportPreviewRow[] {
  const trimmedImport = rawImport.trim();

  if (!trimmedImport) {
    return [];
  }

  if (looksLikeJson(trimmedImport)) {
    try {
      return normalizeParsedJson(JSON.parse(trimmedImport) as unknown, sourceName);
    } catch {
      return [createInvalidPreviewRow(0, undefined, "Import must be valid JSON.")];
    }
  }

  const csvRows = parseCsvRows(trimmedImport);

  if (csvRows.length > 1 && csvRows[0].length > 1) {
    return normalizeCsvRows(csvRows, sourceName);
  }

  return [
    createInvalidPreviewRow(
      0,
      undefined,
      "Import must be valid JSON, CSV with a header row, or a PDF file upload.",
    ),
  ];
}

export function createPdfArtifactImportRows(
  fileName: string,
  arrayBuffer: ArrayBuffer,
  mimeType = "application/pdf",
): ImportPreviewRow[] {
  return [
    createPreviewRow(
      buildPdfArtifact(fileName, mimeType, arrayBuffer),
      0,
      "PDF normalized as a review artifact. Text extraction is best effort.",
    ),
  ];
}

export function mergeArtifacts(importedArtifacts: AgentArtifact[], currentArtifacts: AgentArtifact[]) {
  return Array.from(
    new Map([...importedArtifacts, ...currentArtifacts].map((artifact) => [artifact.id, artifact])).values(),
  );
}

function normalizeParsedJson(parsedImport: unknown, sourceName: string): ImportPreviewRow[] {
  if (isPreCallBriefBundle(parsedImport)) {
    return normalizePreCallBriefBundle(parsedImport, sourceName);
  }

  if (isDealPipelineAnalysis(parsedImport)) {
    return [createPreviewRow(buildDealPipelineArtifact(parsedImport, sourceName), 0, "Deal analysis normalized.")];
  }

  const artifactInputs = Array.isArray(parsedImport) ? parsedImport : [parsedImport];

  if (artifactInputs.length === 0) {
    return [createInvalidPreviewRow(0, undefined, "Import must include at least one artifact.")];
  }

  if (artifactInputs.every(looksLikeArtifactInput)) {
    return artifactInputs.map((input, index) => cleanArtifactInput(input, index));
  }

  if (Array.isArray(parsedImport) && artifactInputs.every(isRecord)) {
    return artifactInputs.map((input, index) =>
      createPreviewRow(buildGenericJsonArtifact(input, index, sourceName), index, "JSON row normalized."),
    );
  }

  return [createPreviewRow(buildGenericJsonArtifact(parsedImport, 0, sourceName), 0, "JSON object normalized.")];
}

function normalizePreCallBriefBundle(bundle: JsonRecord, sourceName: string): ImportPreviewRow[] {
  const briefs = asArray(bundle.briefs);

  if (briefs.length === 0) {
    return [createInvalidPreviewRow(0, bundle, "Pre-call brief JSON did not include any briefs.")];
  }

  return briefs.map((brief, index) => {
    if (!isRecord(brief)) {
      return createInvalidPreviewRow(index, brief, "Each pre-call brief must be a JSON object.");
    }

    return createPreviewRow(
      buildPreCallBriefArtifact(brief, index, sourceName, asRecord(bundle.metadata)),
      index,
      "Pre-call brief normalized.",
    );
  });
}

function normalizeCsvRows(rows: string[][], sourceName: string): ImportPreviewRow[] {
  const headers = rows[0].map((header, index) => cleanText(header) || `column_${index + 1}`);
  const records = rows
    .slice(1)
    .map((row) =>
      Object.fromEntries(headers.map((header, index) => [dedupeHeader(header, headers, index), cleanText(row[index])])),
    )
    .filter((record) => Object.values(record).some(Boolean));

  if (records.length === 0) {
    return [createInvalidPreviewRow(0, undefined, "CSV import must include at least one data row.")];
  }

  return records.map((record, index) =>
    createPreviewRow(buildCsvArtifact(record, index, sourceName), index, "CSV row normalized."),
  );
}

function cleanArtifactInput(input: unknown, index: number): ImportPreviewRow {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createInvalidPreviewRow(index, input, "Each artifact must be a JSON object.");
  }

  const artifact = input as ArtifactImportInput;
  const errors = [
    getRequiredTextError(artifact.title, "title"),
    getRequiredTextError(artifact.body, "body"),
    getMetadataError(artifact.metadata),
    getPayloadError(artifact.payload),
  ].filter(Boolean);

  const kind = validKinds.includes(artifact.kind as AgentArtifactKind)
    ? (artifact.kind as AgentArtifactKind)
    : "Research note";
  const status = validStatuses.includes(artifact.status as AgentArtifactStatus)
    ? (artifact.status as AgentArtifactStatus)
    : "Imported";
  const title = cleanRequiredText(artifact.title) || "—";
  const source = cleanOptionalText(artifact.source) ?? "—";

  if (errors.length > 0) {
    return {
      rowId: `row-${index}`,
      index,
      kind,
      status,
      title,
      source,
      validationStatus: "Invalid",
      errorMessage: `${errors.join(" ")} Correct the JSON and the preview will update.`,
    };
  }

  return createPreviewRow(
    {
      id: cleanOptionalText(artifact.id),
      kind,
      status,
      title: cleanRequiredText(artifact.title),
      body: cleanRequiredText(artifact.body),
      accountId: cleanOptionalText(artifact.accountId),
      contactId: cleanOptionalText(artifact.contactId),
      source: cleanOptionalText(artifact.source),
      metadata: isJsonObject(artifact.metadata) ? artifact.metadata : undefined,
      payload: isJsonValue(artifact.payload) ? artifact.payload : undefined,
    },
    index,
    "",
  );
}

function buildPreCallBriefArtifact(
  brief: JsonRecord,
  index: number,
  sourceName: string,
  bundleMetadata?: JsonRecord,
): CleanArtifactInput {
  const meeting = asRecord(brief.meeting) ?? {};
  const account = asRecord(brief.account) ?? {};
  const accountSnapshot = asRecord(brief.account_snapshot) ?? {};
  const contactAngle = asRecord(brief.contact_angle) ?? {};
  const accountName = firstText(account, ["name", "account_name"]) || `Imported account ${index + 1}`;
  const accountId = firstText(brief, ["account_id"]) || firstText(account, ["id"]) || slug(accountName);
  const subject = firstText(meeting, ["subject", "title"]) || `Pre-call brief for ${accountName}`;
  const briefId = firstText(brief, ["brief_id"]) || `precall-${slug(accountName)}-${index + 1}`;
  const externalAttendees = asArray(meeting.external_attendees).filter(isRecord);
  const primaryAttendee = externalAttendees[0];
  const contactName = primaryAttendee
    ? firstText(primaryAttendee, ["name", "email"]) || "External attendee"
    : undefined;
  const contactId = contactName ? `${accountId}-${slug(contactName)}` : undefined;
  const accountRead = firstText(accountSnapshot, ["account_read", "summary"]) || formatRecord(accountSnapshot);
  const sellerNote = firstText(accountSnapshot, ["seller_note"]);
  const approachNote = firstText(contactAngle, ["approach_note"]);
  const opener = firstText(brief, ["opener_next_step_ask", "next_step"]);
  const valueAngles = asArray(brief.d2l_value_angles);
  const discoveryQuestions = asArray(brief.discovery_questions);
  const objections = asArray(brief.likely_objections);
  const timingSignals = asArray(asRecord(accountSnapshot.timing_signals) ?? accountSnapshot.timing_signals);
  const body = joinSections([
    `Meeting: ${subject}`,
    `Account: ${accountName}`,
    accountRead && `Account read:\n${accountRead}`,
    sellerNote && `Seller note:\n${sellerNote}`,
    approachNote && `Approach:\n${approachNote}`,
    valueAngles.length > 0 && `D2L value angles:\n${formatList(valueAngles)}`,
    discoveryQuestions.length > 0 && `Discovery questions:\n${formatList(discoveryQuestions)}`,
    objections.length > 0 && `Likely objections:\n${formatList(objections)}`,
    opener && `Opener / next step:\n${opener}`,
  ]);

  const contact = primaryAttendee
    ? {
        id: contactId,
        accountId,
        name: contactName,
        role: "Meeting attendee",
        influence: "Evaluator",
        relationship: "Warm",
        lastTouch: firstText(meeting, ["start_local"]) || "Imported pre-call brief",
        angle: approachNote || "Review pre-call brief context before outreach.",
      }
    : undefined;

  return {
    id: briefId,
    kind: "Pre-call brief",
    status: "Imported",
    title: `Pre-call brief: ${accountName} — ${subject}`,
    accountId,
    contactId,
    body: body || `Pre-call brief imported for ${accountName}.`,
    source: sourceName,
    metadata: asJsonObject({
      importFormat: "precall_briefs_json",
      sourceName,
      briefStatus: firstText(brief, ["brief_status"]),
      meeting,
      account,
      createdAtLocal: firstText(bundleMetadata, ["created_at_local"]),
      timezone: firstText(bundleMetadata, ["timezone"]),
    }),
    payload: asJsonValue({
      accounts: [
        compactObject({
          accountId,
          accountName,
          stage: firstText(brief, ["brief_status"]) || "Pre-call brief imported",
          fitScore: scoreFromRating(firstText(asRecord(accountSnapshot.icp_fit), ["rating"])),
          timingScore: timingSignals.length > 0 ? 78 : 55,
          snapshot: accountRead || `Imported pre-call brief for ${accountName}.`,
          knownPain: valueAngles.map(formatValue).filter(Boolean).slice(0, 4),
          researchGaps: objections.map(formatValue).filter(Boolean).slice(0, 4),
          recommendedAction: opener || sellerNote || "Review the pre-call brief and pick the next buyer-facing move.",
          whyItMatters: sellerNote || approachNote || "Imported pre-call context may shape the next meeting.",
          softCta: opener || "Ask for a practical next step.",
          valueAngles: valueAngles.map(formatValue).filter(Boolean).slice(0, 5),
          contacts: contact ? [contact] : undefined,
          triggers: timingSignals.map((signal, signalIndex) => ({
            accountId,
            title: firstText(asRecord(signal), ["signal", "title"]) || `Timing signal ${signalIndex + 1}`,
            source: "Pre-call brief",
            whyItMatters: firstText(asRecord(signal), ["why_it_matters", "whyItMatters"]) || formatValue(signal),
            nextAction: sellerNote || opener || "Validate the signal in the meeting.",
          })),
          actionItems: [
            {
              accountId,
              contactId,
              title: `Prepare for ${subject}`,
              due: firstText(meeting, ["start_local"]) || "This week",
              priority: "High",
              status: "This Week",
              whyItMatters: sellerNote || "Pre-call prep is ready for seller review.",
              nextAction: opener || "Use the brief to guide the next conversation.",
            },
          ],
        }),
      ],
      meetings: [
        compactObject({
          id: briefId,
          accountId,
          contactId,
          contactName,
          title: subject,
          time: firstText(meeting, ["start_local"]) || "Imported pre-call brief",
          context: accountRead || `Imported pre-call context for ${accountName}.`,
          prepNeed: sellerNote || approachNote || "Review imported brief before the call.",
          goal: opener || "Leave with a clear next step.",
          risk: objections.length > 0 ? formatList(objections) : "Brief evidence should be reviewed before use.",
        }),
      ],
    }),
  };
}

function buildDealPipelineArtifact(analysis: JsonRecord, sourceName: string): CleanArtifactInput {
  const source = asRecord(analysis.source);
  const asOf = asRecord(analysis.as_of);
  const opportunities = asArray(analysis.opportunities).filter(isRecord);
  const headline = firstText(analysis, ["headline_judgment"]) || "Deal pipeline analysis imported.";
  const nextMoves = asArray(analysis.recommended_next_moves);
  const openQuestions = asArray(analysis.open_questions);
  const titleDate = firstText(asOf, ["user_local_datetime"]) || firstText(source, ["file"]) || sourceName;
  const body = joinSections([
    headline,
    formatPortfolioSummary(asRecord(analysis.portfolio_summary)),
    nextMoves.length > 0 && `Recommended next moves:\n${formatList(nextMoves)}`,
    openQuestions.length > 0 && `Open questions:\n${formatList(openQuestions)}`,
    `Opportunities analyzed: ${opportunities.length}`,
  ]);

  return {
    id: `deal-pipeline-${slug(titleDate)}`,
    kind: "Research note",
    status: "Imported",
    title: `Deal pipeline analysis: ${shorten(titleDate, 70)}`,
    body,
    source: sourceName,
    metadata: asJsonObject({
      importFormat: "deal_pipeline_analysis_json",
      sourceName,
      source,
      asOf,
      confidence: asRecord(analysis.confidence),
      rankings: asRecord(analysis.rankings),
      meddpiccSummary: asRecord(analysis.meddpicc_summary),
    }),
    payload: asJsonValue({
      accounts: opportunities.map((opportunity, index) => buildOpportunityAccount(opportunity, index, sourceName)),
      actionItems: nextMoves.flatMap((move, index) => buildDealMoveActionItems(move, index, opportunities)),
    }),
  };
}

function buildOpportunityAccount(opportunity: JsonRecord, index: number, sourceName: string) {
  const accountName =
    firstText(opportunity, ["account", "account_name", "organization"]) ||
    firstText(opportunity, ["opportunity_name", "opportunity"]) ||
    `Imported opportunity ${index + 1}`;
  const opportunityName = firstText(opportunity, ["opportunity_name", "opportunity", "deal_name"]) || accountName;
  const accountId = firstText(opportunity, ["account_id"]) || slug(accountName);
  const riskScore = parseNumber(firstText(opportunity, ["engagement_risk_score", "risk_score"])) ?? 45;
  const recommendedAction =
    firstText(opportunity, ["recommended_action", "next_step", "next_steps"]) ||
    "Review imported deal analysis and confirm the next buyer-owned action.";

  return compactObject({
    accountId,
    accountName,
    stage: firstText(opportunity, ["stage", "forecast_category"]) || "Imported deal analysis",
    arrPotential:
      parseNumber(firstText(opportunity, ["bookings_usd", "arr_usd", "amount", "bookings"])) ?? undefined,
    fitScore: clampScore(80 - riskScore / 2),
    timingScore: firstText(opportunity, ["next_event_utc", "next_event"]) ? 82 : 48,
    momentumScore: scoreFromMomentum(firstText(opportunity, ["momentum"])) ?? clampScore(85 - riskScore),
    riskScore: clampScore(riskScore),
    relationshipStatus: riskScore >= 70 ? "At Risk" : firstText(opportunity, ["next_event_utc"]) ? "Active" : "Warm",
    snapshot: joinSentences([
      `${opportunityName} imported from ${sourceName}.`,
      firstText(opportunity, ["forecast_category"]) && `Forecast: ${firstText(opportunity, ["forecast_category"])}.`,
      firstText(opportunity, ["risk_level"]) && `Risk: ${firstText(opportunity, ["risk_level"])}.`,
      firstText(opportunity, ["confidence"]) && `Confidence: ${firstText(opportunity, ["confidence"])}.`,
    ]),
    knownPain: asArray(opportunity.signals).map(formatValue).filter(Boolean),
    researchGaps: firstText(opportunity, ["evidence_quality"])
      ? [`Evidence quality: ${firstText(opportunity, ["evidence_quality"])}`]
      : [],
    recommendedAction,
    whyItMatters: firstText(opportunity, ["priority"]) || "Imported opportunity needs pipeline review.",
    softCta: recommendedAction,
    valueAngles: [
      firstText(opportunity, ["forecast_category"]) && `Forecast: ${firstText(opportunity, ["forecast_category"])}`,
      firstText(opportunity, ["stage"]) && `Stage: ${firstText(opportunity, ["stage"])}`,
      firstText(opportunity, ["momentum"]) && `Momentum: ${firstText(opportunity, ["momentum"])}`,
    ].filter(Boolean),
    triggers: asArray(opportunity.signals).map((signal, signalIndex) => ({
      accountId,
      title: formatValue(signal) || `Deal signal ${signalIndex + 1}`,
      source: "Deal pipeline analysis",
      detectedAt: firstText(opportunity, ["next_event_utc", "close_date"]) || "Imported",
      whyItMatters: firstText(opportunity, ["risk_level"]) || "Signal came from imported deal analysis.",
      nextAction: recommendedAction,
    })),
    actionItems: [
      {
        accountId,
        title: recommendedAction,
        due: firstText(opportunity, ["next_event_utc", "close_date"]) || "This week",
        priority: riskScore >= 65 ? "High" : "Medium",
        status: firstText(opportunity, ["next_event_utc"]) ? "This Week" : "Due Today",
        whyItMatters: firstText(opportunity, ["risk_level"]) || "Deal action imported from pipeline analysis.",
        nextAction: recommendedAction,
      },
    ],
  });
}

function buildDealMoveActionItems(move: unknown, index: number, opportunities: JsonRecord[]) {
  const moveRecord = asRecord(move) ?? {};
  const action = firstText(moveRecord, ["action", "title"]) || formatValue(move) || `Deal next move ${index + 1}`;
  const why = firstText(moveRecord, ["why", "why_it_matters"]);
  const targetOpportunities = asArray(moveRecord.target_opportunities)
    .map(formatValue)
    .filter(Boolean);

  return targetOpportunities.map((target, targetIndex) => {
    const targetOpportunity = opportunities.find(
      (opportunity) => firstText(opportunity, ["opportunity_name", "account"]) === target,
    );
    const accountName = targetOpportunity
      ? firstText(targetOpportunity, ["account", "account_name"]) || target
      : target;

    return {
      id: `deal-move-${index + 1}-${targetIndex + 1}-${slug(target)}`,
      accountId: slug(accountName),
      title: action,
      due: "This week",
      priority: index === 0 ? "High" : "Medium",
      status: "This Week",
      whyItMatters: why || "Recommended by imported deal analysis.",
      nextAction: action,
    };
  });
}

function buildCsvArtifact(record: CsvRecord, index: number, sourceName: string): CleanArtifactInput {
  const accountName =
    firstText(record, ["account", "account_name", "company", "organization"]) ||
    firstText(record, ["opportunity_name", "opportunity", "deal_name"]) ||
    `CSV row ${index + 1}`;
  const title =
    firstText(record, ["title", "subject", "opportunity_name", "opportunity", "deal_name"]) ||
    `CSV import: ${accountName}`;
  const accountId = slug(accountName);
  const recommendedAction =
    firstText(record, ["recommended_action", "next_action", "next_step", "next_steps"]) ||
    "Review this imported CSV row and decide the next action.";
  const isDealLike = hasAnyKey(record, [
    "opportunity",
    "opportunity_name",
    "deal",
    "deal_name",
    "stage",
    "forecast_category",
    "close_date",
    "bookings",
    "bookings_usd",
    "arr",
    "arr_usd",
  ]);

  return {
    id: `csv-${slug(sourceName)}-${index + 1}-${slug(title)}`,
    kind: "Research note",
    status: "Imported",
    title,
    accountId,
    body: formatRecord(record),
    source: sourceName,
    metadata: asJsonObject({
      importFormat: "csv",
      sourceName,
      rowIndex: index + 1,
      columns: record,
    }),
    payload: asJsonValue({
      accounts: [
        compactObject({
          accountId,
          accountName,
          stage: firstText(record, ["stage", "forecast_category"]) || (isDealLike ? "Imported CSV deal" : "Imported CSV row"),
          arrPotential: parseNumber(firstText(record, ["bookings_usd", "bookings", "arr_usd", "arr", "amount"])),
          fitScore: 60,
          timingScore: firstText(record, ["next_event", "next_event_utc", "close_date"]) ? 74 : 52,
          momentumScore: 58,
          riskScore: parseNumber(firstText(record, ["risk_score", "engagement_risk_score"])) ?? 40,
          snapshot: formatRecord(record),
          recommendedAction,
          whyItMatters: firstText(record, ["why_it_matters", "notes", "signal"]) || "Imported CSV row needs seller review.",
          softCta: recommendedAction,
          valueAngles: [
            firstText(record, ["stage"]) && `Stage: ${firstText(record, ["stage"])}`,
            firstText(record, ["forecast_category"]) && `Forecast: ${firstText(record, ["forecast_category"])}`,
          ].filter(Boolean),
          triggers: firstText(record, ["signal", "trigger"])
            ? [
                {
                  accountId,
                  title: firstText(record, ["signal", "trigger"]),
                  source: sourceName,
                  detectedAt: firstText(record, ["date", "detected_at", "created_at"]) || "Imported",
                  whyItMatters: firstText(record, ["why_it_matters", "notes"]) || "Imported CSV signal.",
                  nextAction: recommendedAction,
                },
              ]
            : undefined,
          actionItems: [
            {
              accountId,
              title: recommendedAction,
              due: firstText(record, ["due", "due_date", "next_event_utc", "close_date"]) || "This week",
              priority: "Medium",
              status: "This Week",
              whyItMatters: firstText(record, ["why_it_matters", "notes"]) || "Imported CSV row needs follow-up.",
              nextAction: recommendedAction,
            },
          ],
        }),
      ],
    }),
  };
}

function buildGenericJsonArtifact(value: unknown, index: number, sourceName: string): CleanArtifactInput {
  const record = isRecord(value) ? value : { value };
  const title =
    firstText(record, ["title", "subject", "name", "account", "account_name", "opportunity_name"]) ||
    `${sourceName} item ${index + 1}`;

  return {
    id: `json-${slug(sourceName)}-${index + 1}-${slug(title)}`,
    kind: "Research note",
    status: "Imported",
    title,
    accountId: slug(firstText(record, ["account", "account_name", "organization"]) || title),
    body: firstText(record, ["body", "summary", "notes"]) || formatRecord(record),
    source: sourceName,
    metadata: asJsonObject({
      importFormat: "generic_json",
      sourceName,
      rowIndex: index + 1,
      fields: record,
    }),
    payload: asJsonValue({
      accounts: [
        compactObject({
          accountId: slug(firstText(record, ["account", "account_name", "organization"]) || title),
          accountName: firstText(record, ["account", "account_name", "organization"]) || title,
          stage: firstText(record, ["stage", "status"]) || "Imported JSON",
          snapshot: firstText(record, ["body", "summary", "notes"]) || formatRecord(record),
          recommendedAction:
            firstText(record, ["recommended_action", "next_action", "next_step"]) ||
            "Review imported JSON and choose the next action.",
          whyItMatters: "Generic JSON import normalized for Agent Inbox review.",
        }),
      ],
    }),
  };
}

function buildPdfArtifact(fileName: string, mimeType: string, arrayBuffer: ArrayBuffer): CleanArtifactInput {
  const extractedText = extractPdfText(arrayBuffer);
  const body = extractedText
    ? `Best-effort PDF text extracted from ${fileName}:\n\n${extractedText}`
    : `PDF file imported from ${fileName}. Text extraction was not available in this browser-only prototype, so review the source PDF before promoting.`;

  return {
    id: `pdf-${slug(fileName)}`,
    kind: "Research note",
    status: "Imported",
    title: `PDF review: ${fileName}`,
    body,
    source: fileName,
    metadata: asJsonObject({
      importFormat: "pdf",
      fileName,
      mimeType,
      sizeBytes: arrayBuffer.byteLength,
      extractionMode: "best_effort_browser_text",
      extractedTextLength: extractedText.length,
    }),
    payload: asJsonValue({
      accounts: [
        {
          accountId: slug(fileName),
          accountName: fileName.replace(/\\.pdf$/i, ""),
          stage: "Imported PDF review",
          snapshot: body,
          recommendedAction: "Review the imported PDF and decide whether to promote its contents.",
          whyItMatters: "PDF import captured a review artifact for follow-up.",
          softCta: "Open the source PDF before using any extracted text.",
          valueAngles: extractedText ? [shorten(extractedText, 220)] : [],
        },
      ],
    }),
  };
}

function createPreviewRow(artifact: CleanArtifactInput, index: number, message: string): ImportPreviewRow {
  return {
    rowId: `row-${index}`,
    index,
    kind: artifact.kind,
    status: artifact.status,
    title: artifact.title,
    source: artifact.source ?? "—",
    validationStatus: "Valid",
    errorMessage: message,
    artifact,
  };
}

function createInvalidPreviewRow(index: number, input: unknown, errorMessage: string): ImportPreviewRow {
  const artifact = input && typeof input === "object" && !Array.isArray(input) ? (input as ArtifactImportInput) : undefined;

  return {
    rowId: `row-${index}`,
    index,
    kind: validKinds.includes(artifact?.kind as AgentArtifactKind) ? (artifact?.kind as AgentArtifactKind) : "—",
    status: validStatuses.includes(artifact?.status as AgentArtifactStatus) ? (artifact?.status as AgentArtifactStatus) : "—",
    title: cleanRequiredText(artifact?.title) || "—",
    source: cleanOptionalText(artifact?.source) ?? "—",
    validationStatus: "Invalid",
    errorMessage: `${errorMessage} Correct the import and the preview will update.`,
  };
}

function parseCsvRows(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  row.push(field);
  rows.push(row);

  return rows.filter((currentRow) => currentRow.some((cell) => cell.trim()));
}

function extractPdfText(arrayBuffer: ArrayBuffer) {
  const decoded = new TextDecoder("latin1").decode(new Uint8Array(arrayBuffer));
  const literalMatches = [...decoded.matchAll(/\((?:\\.|[^\r\n()]){3,}\)/g)]
    .map((match) => unescapePdfString(match[0].slice(1, -1)))
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter((value) => value.length > 8 && /[a-zA-Z]/.test(value));
  const uniqueText = Array.from(new Set(literalMatches)).slice(0, 80).join(" ");

  return shorten(uniqueText, 4000);
}

function unescapePdfString(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .split("\\(")
    .join("(")
    .split("\\)")
    .join(")")
    .replace(/\\\\/g, "\\");
}

function looksLikeJson(value: string) {
  return value.startsWith("{") || value.startsWith("[");
}

function looksLikeArtifactInput(value: unknown) {
  if (!isRecord(value)) return false;
  return ["kind", "status", "title", "body", "payload", "metadata"].some((key) => key in value);
}

function isPreCallBriefBundle(value: unknown): value is JsonRecord {
  return isRecord(value) && Array.isArray(value.briefs);
}

function isDealPipelineAnalysis(value: unknown): value is JsonRecord {
  if (!isRecord(value)) return false;
  return (
    firstText(value, ["analysis_type"]).includes("deal_pipeline") ||
    (Array.isArray(value.opportunities) && typeof value.headline_judgment === "string")
  );
}

function isRecord(value: unknown): value is JsonRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function asRecord(value: unknown): JsonRecord | undefined {
  return isRecord(value) ? value : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function firstText(record: JsonRecord | undefined, keys: string[]) {
  if (!record) return "";

  const normalizedEntries = new Map(
    Object.entries(record).map(([key, value]) => [normalizeKey(key), value]),
  );

  for (const key of keys) {
    const value = normalizedEntries.get(normalizeKey(key));
    const text = cleanRequiredText(value);

    if (text) {
      return text;
    }
  }

  return "";
}

function hasAnyKey(record: CsvRecord, keys: string[]) {
  const normalizedKeys = new Set(Object.keys(record).map(normalizeKey));
  return keys.some((key) => normalizedKeys.has(normalizeKey(key)));
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "imported";
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanRequiredText(value: unknown) {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getRequiredTextError(value: unknown, field: string) {
  return typeof value !== "string" || !value.trim() ? `Each artifact needs a ${field}.` : "";
}

function getMetadataError(metadata: unknown) {
  if (metadata === undefined) return "";
  if (!isJsonObject(metadata)) return "Metadata must be an object with JSON-compatible values.";
  return "";
}

function getPayloadError(payload: unknown) {
  if (payload === undefined) return "";
  return isJsonValue(payload) ? "" : "Payload must be valid JSON data.";
}

function isJsonObject(value: unknown): value is Record<string, JsonValue> {
  return !!value && typeof value === "object" && !Array.isArray(value) && isJsonValue(value);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;
  if (["string", "number", "boolean"].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every(isJsonValue);
  }
  return false;
}

function asJsonObject(value: Record<string, unknown>) {
  const jsonValue = asJsonValue(value);
  return isJsonObject(jsonValue) ? jsonValue : undefined;
}

function asJsonValue(value: unknown): JsonValue | undefined {
  if (value === undefined || typeof value === "function" || typeof value === "symbol" || typeof value === "bigint") {
    return undefined;
  }

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(asJsonValue).filter((item): item is JsonValue => item !== undefined);
  }

  if (typeof value === "object") {
    const output: Record<string, JsonValue> = {};

    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      const jsonValue = asJsonValue(nestedValue);

      if (jsonValue !== undefined) {
        output[key] = jsonValue;
      }
    }

    return output;
  }

  return undefined;
}

function compactObject(value: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(value).filter(([, nestedValue]) => nestedValue !== undefined && nestedValue !== ""));
}

function formatPortfolioSummary(summary: JsonRecord | undefined) {
  if (!summary) return "";

  const lines = [
    firstText(summary, ["opportunity_count"]) && `Opportunities: ${firstText(summary, ["opportunity_count"])}`,
    firstText(summary, ["total_bookings_usd"]) && `Total bookings: $${firstText(summary, ["total_bookings_usd"])}`,
    firstText(summary, ["total_arr_usd"]) && `Total ARR: $${firstText(summary, ["total_arr_usd"])}`,
    firstText(summary, ["weighted_pipeline_read"]),
  ].filter(Boolean);

  return lines.length > 0 ? `Portfolio summary:\n${lines.join("\n")}` : "";
}

function formatRecord(record: unknown) {
  if (!isRecord(record)) return formatValue(record);

  return Object.entries(record)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${humanizeKey(key)}: ${formatValue(value)}`)
    .join("\n");
}

function formatList(items: unknown[]) {
  return items.map(formatValue).filter(Boolean).map((item) => `- ${item}`).join("\n");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(formatValue).filter(Boolean).join("; ");
  if (isRecord(value)) {
    const priorityKeys = [
      "question",
      "angle_name",
      "priority",
      "action",
      "signal",
      "title",
      "subject",
      "why_it_matters",
      "proof_point",
      "reason",
      "counter",
    ];
    const preferred = priorityKeys.map((key) => firstText(value, [key])).filter(Boolean);

    if (preferred.length > 0) {
      return preferred.join(": ");
    }

    return formatRecord(value).replace(/\n/g, "; ");
  }

  return "";
}

function humanizeKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function joinSections(sections: Array<string | false | undefined>) {
  return sections.filter(Boolean).join("\n\n");
}

function joinSentences(sentences: Array<string | false | undefined>) {
  return sentences.filter(Boolean).join(" ");
}

function shorten(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function parseNumber(value: string) {
  if (!value) return undefined;
  const parsed = Number(value.replace(/[$,%\s,]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreFromRating(rating: string) {
  const normalized = rating.toLowerCase();
  if (normalized.includes("strong")) return 86;
  if (normalized.includes("moderate")) return 68;
  if (normalized.includes("weak")) return 42;
  return 60;
}

function scoreFromMomentum(momentum: string) {
  const normalized = momentum.toLowerCase();
  if (!normalized) return undefined;
  if (normalized.includes("strong") || normalized.includes("healthy")) return 82;
  if (normalized.includes("mixed")) return 60;
  if (normalized.includes("stale") || normalized.includes("risk")) return 35;
  return 55;
}

function dedupeHeader(header: string, headers: string[], index: number) {
  return headers.indexOf(header) === index ? header : `${header}_${index + 1}`;
}
