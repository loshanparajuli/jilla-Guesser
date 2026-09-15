"use client";

// naam-bakas — the box you type into, and the hint that shows up when you stall.

import { useEffect, useRef, useState } from "react";
import { aruBaaki, milau, najikkoJilla } from "@/lib/milaune.ts";

/** Stuck this long, with nothing landing, before we offer anything. */
const RUKNE = 10_000;
/** And only after this many near-misses, so a hint is never an accident. */
const GALAT_CHAHINCHA = 3;
/** A wrong attempt counts once the player stops typing this long. */
const THAMNE = 1200;
/** A near-miss spelling waits this long before it submits itself. */
const NAJIK_THAMNE = 600;
/** How long a hint stays parked in the box. */
const SANKET_SAMAYA = 12_000;

export function NaamBakas({
  band,
  bhetiyo,
  safalta,
  onAnumaan,
}: {
  band: boolean;
  bhetiyo: ReadonlySet<string>;
  /** Goes up on every correct answer — resets the stall timer. */
  safalta: number;
  /** Returns true when the guess landed, which clears the box. */
  onAnumaan: (text: string) => boolean;
}) {
  const [text, setText] = useState("");
  const [sanket, setSanket] = useState<string | null>(null);
  const bakas = useRef<HTMLInputElement>(null);

  /** How the player is doing right now: misses, the last one, and when they last scored. */
  const halat = useRef({ galat: 0, antimGalat: "", antimSafal: Date.now() });
  const thamneTimer = useRef<number | undefined>(undefined);
  const najikTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!band) bakas.current?.focus();
  }, [band]);

  // A correct answer wipes the slate: no hint, and the ten seconds start over.
  useEffect(() => {
    halat.current = { galat: 0, antimGalat: "", antimSafal: Date.now() };
    setSanket(null);
  }, [safalta]);

  // Watch for a stall. Nothing here touches the box until both conditions hold.
  useEffect(() => {
    if (band) return;
    const id = window.setInterval(() => {
      const h = halat.current;
      if (Date.now() - h.antimSafal < RUKNE) return;
      if (h.galat < GALAT_CHAHINCHA || !h.antimGalat) return;

      const najik = najikkoJilla(h.antimGalat, bhetiyo);
      if (!najik) return;

      setSanket(najik);
      // Reset the clock so hints stay at least ten seconds apart.
      halat.current = { galat: 0, antimGalat: "", antimSafal: Date.now() };
    }, 1000);
    return () => window.clearInterval(id);
  }, [band, bhetiyo]);

  // Hints don't linger.
  useEffect(() => {
    if (!sanket) return;
    const id = window.setTimeout(() => setSanket(null), SANKET_SAMAYA);
    return () => window.clearTimeout(id);
  }, [sanket]);

  const pathau = (raw: string) => {
    if (!onAnumaan(raw)) return false;
    setText("");
    return true;
  };

  const badliyo = (next: string) => {
    setText(next);
    window.clearTimeout(thamneTimer.current);
    window.clearTimeout(najikTimer.current);

    const milan = milau(next);

    // Spelled right and nothing longer to reach for: land it now, no Enter needed.
    if (milan.kind === "pakka" && !aruBaaki(next, milan.id)) {
      pathau(next);
      return;
    }

    // A typo might just be a word half typed, so give the keyboard a moment to
    // settle before claiming it. Otherwise "sindhupalch" submits and the "ok"
    // they were still typing lands in an empty box.
    if (milan.kind === "najik" && !aruBaaki(next, milan.id)) {
      najikTimer.current = window.setTimeout(() => pathau(next), NAJIK_THAMNE);
      return;
    }

    // Nothing doing — start counting this as a near-miss once they stop typing.
    if (next.trim().length < 3) return;
    thamneTimer.current = window.setTimeout(() => {
      halat.current.galat += 1;
      halat.current.antimGalat = next;
    }, THAMNE);
  };

  useEffect(
    () => () => {
      window.clearTimeout(thamneTimer.current);
      window.clearTimeout(najikTimer.current);
    },
    [],
  );

  return (
    <div className="bakas-khand">
      <input
        id="jilla-naam"
        className="bakas"
        ref={bakas}
        size={1}
        value={text}
        disabled={band}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="go"
        aria-label="Type a district name"
        data-sanket={sanket && !text ? "ho" : undefined}
        placeholder={sanket ?? "type a district…"}
        onChange={(e) => badliyo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            pathau(text);
          } else if (e.key === "Escape") {
            setText("");
          }
        }}
      />

      <p className="tippani">
        {sanket ? (
          // With the box empty the hint sits in the placeholder; if they're still
          // staring at their own spelling, say it here instead.
          text ? <>did you mean <b>{sanket}</b>?</> : <>hint</>
        ) : null}
      </p>
    </div>
  );
}
