"use client";

// khel — the whole game in one hook.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JAMMA, JILLA_BY_ID, type Jilla } from "./jilla.ts";
import { milau, shuruHune } from "./milaune.ts";

export type Ghadi = { id: string; label: string; seconds: number | null };

/** The clocks you can pick, in the order they sit in the header. */
export const GHADI: Ghadi[] = [
  { id: "3", label: "3:00", seconds: 180 },
  { id: "5", label: "5:00", seconds: 300 },
  { id: "10", label: "10:00", seconds: 600 },
  { id: "abhyas", label: "∞", seconds: null },
];

const PAHILO = GHADI[1];

/** ready · playing · over */
export type Awastha = "taiyar" | "khelMa" | "sakiyo";

export type Sandesh =
  | { kind: "thik"; jilla: Jilla }
  | { kind: "pahilenai"; jilla: Jilla }
  | { kind: "dubidha"; names: string[] }
  | null;

const SAVE_KEY = "jilla-guesser:records";

export function useKhel() {
  const [ghadi, setGhadi] = useState<Ghadi>(PAHILO);
  const [awastha, setAwastha] = useState<Awastha>("taiyar");
  const [bhetiyo, setBhetiyo] = useState<string[]>([]);
  const [baaki, setBaaki] = useState(PAHILO.seconds ?? 0);
  const [biteko, setBiteko] = useState(0);
  const [sandesh, setSandesh] = useState<Sandesh>(null);
  const [records, setRecords] = useState<Record<string, number>>({});
  /** The record to beat, as it stood when this run began. */
  const [purano, setPurano] = useState(0);
  /** Bumped on every correct answer. The hint watcher uses it to reset. */
  const [safalta, setSafalta] = useState(0);

  /** Wall-clock deadline, so a backgrounded tab can't gain the player time. */
  const antim = useRef<number | null>(null);
  const shuruBhayo = useRef<number | null>(null);
  const bhetiyoRef = useRef<string[]>([]);
  const recordsRef = useRef<Record<string, number>>({});

  const bhetiyoSet = useMemo(() => new Set(bhetiyo), [bhetiyo]);

  useEffect(() => {
    try {
      setRecords(JSON.parse(window.localStorage.getItem(SAVE_KEY) ?? "{}"));
    } catch {
      /* nothing saved, or storage is off */
    }
  }, []);
  useEffect(() => void (bhetiyoRef.current = bhetiyo), [bhetiyo]);
  useEffect(() => void (recordsRef.current = records), [records]);

  const sakau = useCallback(
    (final: string[]) => {
      setAwastha("sakiyo");
      // Keep the clock where it actually stopped, so "time used" stays honest.
      setBaaki(antim.current === null ? 0 : Math.max(0, Math.round((antim.current - Date.now()) / 1000)));
      antim.current = null;

      setRecords((prev) => {
        if (final.length <= (prev[ghadi.id] ?? 0)) return prev;
        const next = { ...prev, [ghadi.id]: final.length };
        try {
          window.localStorage.setItem(SAVE_KEY, JSON.stringify(next));
        } catch {
          /* private browsing — the run still counts, it just won't persist */
        }
        return next;
      });
    },
    [ghadi.id],
  );

  // The clock. Both readings are recomputed from timestamps on every tick, so a
  // throttled background tab can't drift.
  useEffect(() => {
    if (awastha !== "khelMa") return;
    const tick = () => {
      if (shuruBhayo.current !== null) {
        setBiteko(Math.floor((Date.now() - shuruBhayo.current) / 1000));
      }
      if (antim.current === null) return;
      const left = Math.max(0, Math.round((antim.current - Date.now()) / 1000));
      setBaaki(left);
      if (left === 0) sakau(bhetiyoRef.current);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [awastha, sakau]);

  /** Wind the clock and go. */
  const suru = useCallback((pick: Ghadi) => {
    setGhadi(pick);
    setBhetiyo([]);
    setSandesh(null);
    setBaaki(pick.seconds ?? 0);
    setBiteko(0);
    setPurano(recordsRef.current[pick.id] ?? 0);
    setSafalta(0);
    shuruBhayo.current = Date.now();
    antim.current = pick.seconds === null ? null : Date.now() + pick.seconds * 1000;
    setAwastha("khelMa");
  }, []);

  /** Swap clocks before the first keystroke, without starting anything. */
  const chhan = useCallback((pick: Ghadi) => {
    setGhadi(pick);
    setBaaki(pick.seconds ?? 0);
  }, []);

  const chhodne = useCallback(() => sakau(bhetiyoRef.current), [sakau]);

  /** One guess. Returns true when it landed, so the box knows to clear itself. */
  const anumaan = useCallback(
    (text: string): boolean => {
      if (awastha === "sakiyo") return false;
      const milan = milau(text);

      if (milan.kind === "dubidha") {
        setSandesh({ kind: "dubidha", names: milan.ids.map((id) => JILLA_BY_ID.get(id)!.name) });
        return false;
      }
      if (milan.kind === "kehi-chhaina") {
        // A half-typed stem like "rukum" deserves the choice spelled out.
        const stems = shuruHune(text);
        if (stems.length > 1) {
          setSandesh({ kind: "dubidha", names: stems.map((id) => JILLA_BY_ID.get(id)!.name) });
        }
        return false;
      }

      // The clock starts on the first answer, not when the page loads.
      if (awastha === "taiyar") {
        shuruBhayo.current = Date.now();
        antim.current = ghadi.seconds === null ? null : Date.now() + ghadi.seconds * 1000;
        setPurano(recordsRef.current[ghadi.id] ?? 0);
        setAwastha("khelMa");
      }

      const jilla = JILLA_BY_ID.get(milan.id)!;
      if (bhetiyoSet.has(jilla.id)) {
        setSandesh({ kind: "pahilenai", jilla });
        return true;
      }

      const next = [...bhetiyo, jilla.id];
      setBhetiyo(next);
      setSandesh({ kind: "thik", jilla });
      setSafalta((n) => n + 1);
      if (next.length === JAMMA) sakau(next);
      return true;
    },
    [awastha, bhetiyo, bhetiyoSet, ghadi, sakau],
  );

  return {
    ghadi,
    awastha,
    /** In the order they were named — the list reads newest first. */
    bhetiyo,
    bhetiyoSet,
    ank: bhetiyo.length,
    baaki,
    biteko,
    sandesh,
    safalta,
    record: records[ghadi.id] ?? 0,
    naya: awastha === "sakiyo" && bhetiyo.length > purano,
    suru,
    chhan,
    chhodne,
    anumaan,
    sandeshHatau: useCallback(() => setSandesh(null), []),
  };
}
