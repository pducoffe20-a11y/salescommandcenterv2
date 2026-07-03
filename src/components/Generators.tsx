import {
  AlertTriangle,
  ClipboardCheck,
  Copy,
  FileDown,
  Mail,
  MessageSquareText,
  Printer,
  Sparkles,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { Account, Contact } from "../types";
import {
  FollowUpOutput,
  generateFollowUp,
  generateMeetingPrep,
  MeetingPrepBrief,
  reviewPatVoice,
  VoiceReviewResult,
} from "../services/generators";

interface GeneratorProps {
  accounts: Account[];
  contacts: Contact[];
}

const defaultMeetingInput = {
  account: "Northstar State University",
  contact: "Mira Chen",
  context:
    "The provost posted about first-year retention, and Mira asked for examples of faculty seeing risk earlier.",
  goals:
    "Agree on one retention workflow, one student success metric, and one owner for a pilot.",
  risks:
    "The call could turn into a platform tour before Mira names the current workflow gap.",
};

export function MeetingPrepPage({ accounts, contacts }: GeneratorProps) {
  const [input, setInput] = useState(defaultMeetingInput);
  const [brief, setBrief] = useState<MeetingPrepBrief>(() =>
    buildBrief(defaultMeetingInput, accounts, contacts),
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBrief(buildBrief(input, accounts, contacts));
  }

  return (
    <div className="tool-page">
      <ToolHeader
        eyebrow="Meeting prep generator"
        title="Walk into the call with a useful point of view."
        description="The brief stays grounded in buyer context, current risk, and the one useful next step."
      />
      <div className="tool-grid">
        <form className="panel tool-form" onSubmit={submit}>
          <FormField
            label="Account"
            value={input.account}
            onChange={(value) => setInput({ ...input, account: value })}
            list="account-options"
          />
          <FormField
            label="Contact"
            value={input.contact}
            onChange={(value) => setInput({ ...input, contact: value })}
            list="contact-options"
          />
          <TextAreaField
            label="Meeting context"
            value={input.context}
            onChange={(value) => setInput({ ...input, context: value })}
          />
          <TextAreaField
            label="Goals"
            value={input.goals}
            onChange={(value) => setInput({ ...input, goals: value })}
          />
          <TextAreaField
            label="Risks"
            value={input.risks}
            onChange={(value) => setInput({ ...input, risks: value })}
          />
          <datalist id="account-options">
            {accounts.map((account) => (
              <option key={account.id} value={account.name} />
            ))}
          </datalist>
          <datalist id="contact-options">
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.name} />
            ))}
          </datalist>
          <button className="primary-button" type="submit">
            <Sparkles size={18} aria-hidden="true" />
            Generate prep
          </button>
        </form>

        <BriefPreview brief={brief} compact={false} />
      </div>
    </div>
  );
}

export function PreCallBriefPage({ accounts, contacts }: GeneratorProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0].id);
  const account = accounts.find((item) => item.id === selectedAccountId) ?? accounts[0];
  const accountContacts = contacts.filter(
    (contact) => contact.accountId === account.id,
  );
  const contact = accountContacts[0] ?? contacts[0];
  const brief = useMemo(
    () =>
      generateMeetingPrep(
        {
          account: account.name,
          contact: contact.name,
          context: account.whyItMatters,
          goals: account.recommendedAction,
          risks: account.researchGaps[0],
        },
        account,
        contact,
      ),
    [account, contact],
  );

  return (
    <div className="tool-page">
      <ToolHeader
        eyebrow="Pre-call brief generator"
        title="Build a printable brief that fits on the page."
        description="A concise call plan with opener, questions, value angles, objections, and follow-up draft."
      />
      <div className="brief-toolbar panel">
        <label>
          Account
          <select
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
          >
            {accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button" type="button" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" />
          Print brief
        </button>
      </div>
      <section className="print-shell" aria-label="Printable pre-call brief">
        <div className="printable-brief">
          <header>
            <span>Sales Command Center V2</span>
            <h2>{brief.headline}</h2>
            <p>{account.stage} · {account.region} · {contact.role}</p>
          </header>
          <div className="brief-two-column">
            <BriefBlock title="Account snapshot" content={brief.accountSnapshot} />
            <BriefBlock title="Contact angle" content={brief.contactAngle} />
            <BriefBlock title="Opener" content={brief.opener} />
            <BriefBlock title="Soft next step" content={brief.softNextStep} />
          </div>
          <BriefList title="Value angles" items={brief.valueAngles} />
          <BriefList title="Discovery questions" items={brief.discoveryQuestions} />
          <BriefList title="Likely objections" items={brief.objections} />
          <BriefBlock title="Follow-up draft" content={brief.followUpDraft} />
        </div>
      </section>
    </div>
  );
}

export function FollowUpPage({ accounts, contacts }: GeneratorProps) {
  const [input, setInput] = useState({
    account: "Summit Career College",
    contact: "Omar Patel",
    meetingOutcome:
      "finance needs the migration effort broken into the first three decisions",
    promisedItem: "a short migration decision note",
    nextStep: "a 15-minute readout with Rachel and Omar",
  });
  const [output, setOutput] = useState<FollowUpOutput>(() =>
    generateFollowUp(input),
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOutput(generateFollowUp(input));
  }

  return (
    <div className="tool-page">
      <ToolHeader
        eyebrow="Follow-up builder"
        title="Send the buyer something short enough to answer."
        description="The output keeps the email, CRM note, next task, and follow-up date tied to what actually happened."
      />
      <div className="tool-grid">
        <form className="panel tool-form" onSubmit={submit}>
          <FormField
            label="Account"
            value={input.account}
            onChange={(value) => setInput({ ...input, account: value })}
            list="follow-account-options"
          />
          <FormField
            label="Contact"
            value={input.contact}
            onChange={(value) => setInput({ ...input, contact: value })}
            list="follow-contact-options"
          />
          <TextAreaField
            label="Meeting outcome"
            value={input.meetingOutcome}
            onChange={(value) => setInput({ ...input, meetingOutcome: value })}
          />
          <TextAreaField
            label="Promised item"
            value={input.promisedItem}
            onChange={(value) => setInput({ ...input, promisedItem: value })}
          />
          <TextAreaField
            label="Next step"
            value={input.nextStep}
            onChange={(value) => setInput({ ...input, nextStep: value })}
          />
          <datalist id="follow-account-options">
            {accounts.map((account) => (
              <option key={account.id} value={account.name} />
            ))}
          </datalist>
          <datalist id="follow-contact-options">
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.name} />
            ))}
          </datalist>
          <button className="primary-button" type="submit">
            <Mail size={18} aria-hidden="true" />
            Build follow-up
          </button>
        </form>

        <section className="panel output-panel" aria-labelledby="follow-output">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Generated follow-up</span>
              <h2 id="follow-output">Ready to edit</h2>
            </div>
            <Mail size={20} aria-hidden="true" />
          </div>
          <OutputBlock title="Email" content={output.email} />
          <OutputBlock title="CRM note" content={output.crmNote} />
          <div className="two-up">
            <OutputBlock title="Next task" content={output.nextTask} />
            <OutputBlock
              title="Next follow-up"
              content={output.nextFollowUpDate}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export function VoiceReviewPage() {
  const [email, setEmail] = useState(
    "Subject: Checking in on your LMS priorities\n\nHi Tessa, hope this finds you well. I wanted to touch base and see if we could leverage a robust platform to support your CTE launch. Brightspace offers best-in-class capabilities and scalable solutions for online programs. Are you open to a demo?",
  );
  const [result, setResult] = useState<VoiceReviewResult>(() =>
    reviewPatVoice(email),
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(reviewPatVoice(email));
  }

  return (
    <div className="tool-page">
      <ToolHeader
        eyebrow="Pat voice review"
        title="Make the email sound like a real person wrote it."
        description="Stiff or generic language turns into a warmer note with a lower-pressure ask."
      />
      <div className="tool-grid">
        <form className="panel tool-form" onSubmit={submit}>
          <label>
            Paste sales email
            <textarea
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              rows={13}
            />
          </label>
          <button className="primary-button" type="submit">
            <ClipboardCheck size={18} aria-hidden="true" />
            Review voice
          </button>
        </form>
        <section className="panel output-panel" aria-labelledby="voice-output">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Before and after</span>
              <h2 id="voice-output">Voice notes</h2>
            </div>
            <MessageSquareText size={20} aria-hidden="true" />
          </div>
          <div className="flag-list">
            {result.flags.map((flag) => (
              <div className="flag-item" key={flag}>
                <AlertTriangle size={16} aria-hidden="true" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
          <div className="comparison-grid">
            <OutputBlock title="Before" content={email} />
            <OutputBlock title="After" content={result.rewrite} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ToolHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="tool-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function FormField({
  label,
  value,
  onChange,
  list,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  list?: string;
}) {
  return (
    <label>
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        list={list}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
      />
    </label>
  );
}

function BriefPreview({
  brief,
  compact,
}: {
  brief: MeetingPrepBrief;
  compact: boolean;
}) {
  return (
    <section className="panel output-panel" aria-labelledby="brief-preview">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Generated prep</span>
          <h2 id="brief-preview">{brief.headline}</h2>
        </div>
        <FileDown size={20} aria-hidden="true" />
      </div>
      <BriefBlock title="Account snapshot" content={brief.accountSnapshot} />
      <BriefBlock title="Contact angle" content={brief.contactAngle} />
      <BriefList title="Value angles" items={brief.valueAngles} />
      {!compact && (
        <>
          <BriefList
            title="Discovery questions"
            items={brief.discoveryQuestions}
          />
          <BriefBlock title="Opener" content={brief.opener} />
          <BriefBlock title="Soft next step" content={brief.softNextStep} />
          <BriefBlock title="Follow-up draft" content={brief.followUpDraft} />
        </>
      )}
    </section>
  );
}

function BriefBlock({ title, content }: { title: string; content: string }) {
  return (
    <article className="brief-block">
      <h3>{title}</h3>
      <p>{content}</p>
    </article>
  );
}

function BriefList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="brief-block">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function OutputBlock({ title, content }: { title: string; content: string }) {
  return (
    <article className="output-block">
      <div>
        <h3>{title}</h3>
        <button
          className="icon-button"
          type="button"
          aria-label={`Copy ${title}`}
          onClick={() => navigator.clipboard?.writeText(content)}
        >
          <Copy size={16} aria-hidden="true" />
        </button>
      </div>
      <pre>{content}</pre>
    </article>
  );
}

function buildBrief(
  input: typeof defaultMeetingInput,
  accounts: Account[],
  contacts: Contact[],
) {
  const account = accounts.find((item) => item.name === input.account);
  const contact = contacts.find((item) => item.name === input.contact);
  return generateMeetingPrep(input, account, contact);
}
