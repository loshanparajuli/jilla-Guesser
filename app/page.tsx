"use client";

import { useEffect, useRef, useState } from "react";
import { Dayan, Sandesh, jillaRang } from "@/components/dayan.tsx";
import { NaamBakas } from "@/components/naam-bakas.tsx";
import { Naksa } from "@/components/naksa.tsx";
import { JAMMA } from "@/lib/jilla.ts";
import { GHADI, useKhel } from "@/lib/khel.ts";

/** Seconds as M:SS. */
function ghadiLekha(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function Page() {
  const khel = useKhel();
  const [chamkeko, setChamkeko] = useState<string | null>(null);
  const [abhai, setAbhai] = useState<string | null>(null);
  const flashTimer = useRef<number | undefined>(undefined);

  const sakiyo = khel.awastha === "sakiyo";
  const taiyar = khel.awastha === "taiyar";

  // Flash whichever district was just answered, then let it settle into its tint.
  useEffect(() => {
    if (khel.sandesh?.kind !== "thik") return;
    const id = khel.sandesh.jilla.id;
    setAbhai(id);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setAbhai(null), 750);
    return () => window.clearTimeout(flashTimer.current);
  }, [khel.sandesh]);

  // Messages don't linger.
  useEffect(() => {
    if (!khel.sandesh) return;
    const id = window.setTimeout(khel.sandeshHatau, 2000);
    return () => window.clearTimeout(id);
  }, [khel.sandesh, khel.sandeshHatau]);

  return (
    <>
      {/* Shown instead of the game on phones and tablets — see globals.css. */}
      <div className="sano-parda">
        <span className="chinha">
          <svg viewBox="0 0 15 14" aria-hidden="true">
            <path
              d="M2 1 L12.4 6 L6.6 6 L13 12.4 L2 12.4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
          </svg>
          Jilla<em>Guesser</em>
        </span>
        <h1>
          built for
          <em>desktop.</em>
        </h1>
      </div>

    <div className="khel">
      <header className="sirsak">
        <span className="chinha">
          <svg viewBox="0 0 15 14" aria-hidden="true">
            <path
              d="M2 1 L12.4 6 L6.6 6 L13 12.4 L2 12.4 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
          </svg>
          Jilla<em>Guesser</em>
        </span>

        <div className="ghadi-chhanne">
          {GHADI.map((g) => (
            <button
              key={g.id}
              aria-pressed={khel.ghadi.id === g.id}
              onClick={() => (taiyar ? khel.chhan(g) : khel.suru(g))}
              title={g.seconds === null ? "No clock" : `${g.label} on the clock`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {!taiyar && (
          <button
            className="batan"
            onClick={() => (sakiyo ? khel.suru(khel.ghadi) : khel.chhodne())}
          >
            {sakiyo ? "Play again" : "Give up"}
          </button>
        )}

        <div className="napne">
          <span className={`ank${khel.ghadi.seconds !== null && !sakiyo && khel.baaki <= 30 ? " sakincha" : ""}`}>
            {khel.ghadi.seconds === null ? ghadiLekha(khel.biteko) : ghadiLekha(khel.baaki)}
          </span>
          <span className="thegana">{khel.ghadi.seconds === null ? "elapsed" : sakiyo ? "left" : "to go"}</span>
        </div>

        <div className="napne">
          <span className="ank">
            {khel.ank}
            <em>/{JAMMA}</em>
          </span>
          <span className="thegana">named</span>
        </div>

      </header>

      <main className="maidan">
        <div className="naksa-khand">
          <div className="naksa-thau">
            <Naksa
              bhetiyo={khel.bhetiyoSet}
              khulyo={sakiyo}
              abhai={abhai}
              chamkeko={chamkeko}
              onChamak={setChamkeko}
            />

            {khel.sandesh?.kind === "thik" && (
              <Sandesh>
                <i className="thoplo" style={{ background: jillaRang(khel.sandesh.jilla.id) }} />
                <b>{khel.sandesh.jilla.name}</b>
                <span>{khel.sandesh.jilla.pradesh}</span>
              </Sandesh>
            )}
            {khel.sandesh?.kind === "pahilenai" && (
              <Sandesh>
                <b>{khel.sandesh.jilla.name}</b>
                <span>already named</span>
              </Sandesh>
            )}
            {khel.sandesh?.kind === "dubidha" && (
              <Sandesh>
                <span>did you mean</span>
                <b>{khel.sandesh.names.join(" or ")}?</b>
              </Sandesh>
            )}
          </div>

          {sakiyo ? (
            <div className="nateeja">
              <span className="ank">
                {khel.ank}
                <em>/{JAMMA}</em>
              </span>
              <p>
                {khel.ghadi.seconds === null
                  ? `${ghadiLekha(khel.biteko)} spent`
                  : `${ghadiLekha(khel.ghadi.seconds - khel.baaki)} used`}
                {khel.naya && <span className="naya-record"> · new best</span>}
                {khel.ank < JAMMA && ` · the ${JAMMA - khel.ank} in red are the ones to learn`}
              </p>
              <button className="batan gaadho" onClick={() => khel.suru(khel.ghadi)}>
                Play again
              </button>
            </div>
          ) : (
            <NaamBakas
              band={false}
              bhetiyo={khel.bhetiyoSet}
              safalta={khel.safalta}
              onAnumaan={khel.anumaan}
            />
          )}
        </div>

        <Dayan bhetiyo={khel.bhetiyo} sakiyo={sakiyo} onChamak={setChamkeko} />
      </main>

      <footer className="tala">
        <span>Name all {JAMMA} districts of Nepal before the clock runs out.</span>
        <a
          className="baaki-thau"
          href="https://github.com/loshanparajuli/jilla-Guesser"
          target="_blank"
          rel="noreferrer"
        >
          source code
        </a>
      </footer>
      </div>
    </>
  );
}
