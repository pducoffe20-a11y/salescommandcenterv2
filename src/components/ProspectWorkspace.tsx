import {
  DatabaseZap,
  FileSpreadsheet,
  ListChecks,
  Search,
  Send,
  UsersRound,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { ScoredProspect } from "../types";
import { parseProspects, scoreProspects } from "../services/generators";

const sampleProspects = `Metro Health College, Dana Woods, VP Academic Affairs, Career College, Midwest, clinical program expansion, launching two hybrid nursing cohorts in fall
Riverbend Unified, Malik Stone, Director of Digital Learning, K-12 District, West, parent visibility task force, board asked for clearer progress reporting
Eastern Lakes University, Priya Raman, Associate Provost, Public University, Northeast, retention analytics initiative, gateway course risk work starts in Q3
Pioneer Online School, Unknown Contact, Unknown Role, Virtual School, Southeast, CTE pathway growth, need named executive sponsor
Central Trades Institute, Ben Harper, CFO, Technical College, Central, LMS renewal review, finance comparing support effort before board meeting`;

export function ProspectWorkspace() {
  const [raw, setRaw] = useState(sampleProspects);
  const [prospects, setProspects] = useState<ScoredProspect[]>(() =>
    scoreProspects(parseProspects(sampleProspects)),
  );
  const [boardMessage, setBoardMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProspects(scoreProspects(parseProspects(raw)));
  }

  const groupedContacts = useMemo(() => {
    return prospects.reduce<Record<string, ScoredProspect[]>>((acc, prospect) => {
      acc[prospect.account] = acc[prospect.account] || [];
      acc[prospect.account].push(prospect);
      return acc;
    }, {});
  }, [prospects]);

  const topProspects = [...prospects].sort((a, b) => b.score - a.score).slice(0, 3);

  function createAccountBoard(prospect: ScoredProspect) {
    setBoardMessage(
      `${prospect.account} board staged with ${prospect.actionBoard.length} action items.`,
    );
  }

  return (
    <div className="tool-page">
      <header className="tool-header">
        <span className="eyebrow">Prospect workspace</span>
        <h1>Turn rough account rows into an action board.</h1>
        <p>
          Rough CSV-style rows become scored accounts, contact groups,
          outreach angles, missing research, and a practical account board.
        </p>
      </header>

      <div className="prospect-layout">
        <form className="panel prospect-input" onSubmit={submit}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Input</span>
              <h2>Prospect rows</h2>
            </div>
            <FileSpreadsheet size={20} aria-hidden="true" />
          </div>
          <label>
            CSV-style data
            <textarea
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              rows={12}
            />
          </label>
          <button className="primary-button" type="submit">
            <DatabaseZap size={18} aria-hidden="true" />
            Score accounts
          </button>
        </form>

        <section className="panel prospect-summary" aria-labelledby="prospect-top">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ICP fit</span>
              <h2 id="prospect-top">Best next accounts</h2>
            </div>
            <Search size={20} aria-hidden="true" />
          </div>
          {topProspects.map((prospect) => (
            <article className="prospect-card featured" key={prospect.account}>
              <div className="prospect-score">
                <span>{prospect.fit}</span>
                <strong>{prospect.score}</strong>
              </div>
              <div>
                <h3>{prospect.account}</h3>
                <p>
                  <strong>Buyer:</strong> {prospect.contact}, {prospect.role}
                </p>
                <p>
                  <strong>Why it matters:</strong> {prospect.signal}.{" "}
                  {prospect.notes}
                </p>
                <p>
                  <strong>Recommended outreach angle:</strong>{" "}
                  {prospect.outreachAngle}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>

      <section className="prospect-grid" aria-label="Prospect scoring cards">
        {prospects.map((prospect) => (
          <article className="panel prospect-card" key={`${prospect.account}-${prospect.contact}`}>
            <div className="prospect-card-header">
              <div>
                <span className="eyebrow">{prospect.region}</span>
                <h2>{prospect.account}</h2>
              </div>
              <div className="prospect-score">
                <span>{prospect.fit}</span>
                <strong>{prospect.score}</strong>
              </div>
            </div>
            <dl className="mini-facts">
              <div>
                <dt>Contact</dt>
                <dd>{prospect.contact}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{prospect.role}</dd>
              </div>
              <div>
                <dt>Segment</dt>
                <dd>{prospect.segment}</dd>
              </div>
            </dl>
            <p>
              <strong>Why it matters:</strong> {prospect.signal}. {prospect.notes}
            </p>
            <p>
              <strong>Recommended next action:</strong>{" "}
              {prospect.outreachAngle}
            </p>
            <div className="split-block">
              <div>
                <h3>
                  <ListChecks size={16} aria-hidden="true" />
                  Missing research
                </h3>
                <ul>
                  {prospect.missingResearch.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>
                  <Send size={16} aria-hidden="true" />
                  Action board
                </h3>
                <ul>
                  {prospect.actionBoard.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="text-button" type="button" onClick={() => createAccountBoard(prospect)}>
              Create account board
            </button>
          </article>
        ))}
      </section>

      {boardMessage && (
        <div className="toast inline-toast" role="status">
          {boardMessage}
        </div>
      )}

      <section className="panel grouped-panel" aria-labelledby="grouped-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Grouped contacts</span>
            <h2 id="grouped-heading">Account contact map</h2>
          </div>
          <UsersRound size={20} aria-hidden="true" />
        </div>
        <div className="grouped-grid">
          {Object.entries(groupedContacts).map(([account, rows]) => (
            <article className="compact-item" key={account}>
              <strong>{account}</strong>
              {rows.map((row) => (
                <p key={`${row.contact}-${row.role}`}>
                  {row.contact} · {row.role} · {row.fit}
                </p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
