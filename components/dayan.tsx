"use client";

// dayan — the right-hand rail: province progress on top, and underneath either
// what you have named so far or, once the clock stops, what you missed.

import { JILLA, JILLA_BY_ID, PRADESH, PRADESH_JAMMA, type Pradesh } from "@/lib/jilla.ts";

const rang = (pradesh: Pradesh) => `var(--${pradesh.toLowerCase()})`;

export function Dayan({
  bhetiyo,
  sakiyo,
  onChamak,
}: {
  /** In the order they were named. */
  bhetiyo: readonly string[];
  sakiyo: boolean;
  onChamak: (id: string | null) => void;
}) {
  const naamiyo = new Set(bhetiyo);
  const chhutyo = JILLA.filter((j) => !naamiyo.has(j.id));

  return (
    <aside className="dayan">
      <section className="pradesh-khand">
        <h2>By province</h2>
        <ul className="pradesh-suchi">
          {PRADESH.map((pradesh) => {
            const jamma = PRADESH_JAMMA[pradesh];
            const kati = JILLA.filter((j) => j.pradesh === pradesh && naamiyo.has(j.id)).length;
            return (
              <li
                key={pradesh}
                className={kati === jamma ? "pradesh pugyo" : "pradesh"}
                style={{ "--pradesh-rang": rang(pradesh) } as React.CSSProperties}
              >
                <div className="pradesh-mathi">
                  <span>{pradesh}</span>
                  <span>
                    {kati}/{jamma}
                  </span>
                </div>
                <div className="patti">
                  <i style={{ width: `${(kati / jamma) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {sakiyo ? (
        <Suchi
          title={chhutyo.length ? `Missed · ${chhutyo.length}` : "Nothing missed"}
          empty="Every district named. That is the whole map."
          rows={chhutyo.map((j) => ({ ...j, rang: "var(--rato)" }))}
          onChamak={onChamak}
        />
      ) : (
        <Suchi
          title={`Named · ${bhetiyo.length}`}
          empty="Nothing yet. Start typing."
          rows={[...bhetiyo]
            .reverse()
            .map((id) => JILLA_BY_ID.get(id)!)
            .map((j) => ({ ...j, rang: rang(j.pradesh) }))}
          onChamak={onChamak}
        />
      )}
    </aside>
  );
}

function Suchi({
  title,
  empty,
  rows,
  onChamak,
}: {
  title: string;
  empty: string;
  rows: Array<{ id: string; name: string; pradesh: Pradesh; rang: string }>;
  onChamak: (id: string | null) => void;
}) {
  return (
    <section className="suchi-khand">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="khaali">{empty}</p>
      ) : (
        <ul className="jilla-suchi">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                onMouseEnter={() => onChamak(row.id)}
                onMouseLeave={() => onChamak(null)}
                onFocus={() => onChamak(row.id)}
                onBlur={() => onChamak(null)}
              >
                <span className="thoplo" style={{ background: row.rang }} />
                <span>{row.name}</span>
                <span>{row.pradesh}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Sandesh({ children }: { children: React.ReactNode }) {
  return (
    <div className="sandesh" role="status" aria-live="polite">
      {children}
    </div>
  );
}

export function jillaRang(id: string) {
  const jilla = JILLA_BY_ID.get(id);
  return jilla ? rang(jilla.pradesh) : "transparent";
}
