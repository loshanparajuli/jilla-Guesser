"use client";

// naksa — the map. One polygon per district, plus the names of the ones missed.

import { memo, useMemo, useState } from "react";
import { AREAS, CENTERS, MAP_VIEWBOX, SHAPES } from "@/lib/naksa-data.ts";
import { JILLA, JILLA_BY_ID, type Jilla } from "@/lib/jilla.ts";

const rang = (jilla: Jilla) => `var(--${jilla.pradesh.toLowerCase()})`;

type Haal = "thaha-chhaina" | "bhetiyo" | "chhutyo"; // unknown | found | missed

const Aakriti = memo(function Aakriti({
  jilla,
  haal,
  dhamilo,
  chamkeko,
  abhai,
  onHover,
}: {
  jilla: Jilla;
  haal: Haal;
  dhamilo: boolean;
  chamkeko: boolean;
  abhai: boolean;
  onHover: (id: string | null) => void;
}) {
  const classes = ["jilla", haal !== "thaha-chhaina" && haal, dhamilo && "dhamilo", chamkeko && "chamkeko", abhai && "abhai"];

  return (
    <polygon
      id={jilla.id}
      points={SHAPES[jilla.id]}
      className={classes.filter(Boolean).join(" ")}
      style={{ "--pradesh-rang": rang(jilla) } as React.CSSProperties}
      onMouseEnter={() => onHover(jilla.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* only ever name a district the player is allowed to see */}
      {haal !== "thaha-chhaina" && <title>{`${jilla.name} · ${jilla.pradesh}`}</title>}
    </polygon>
  );
});

/** Bigger districts get their label placed first, so cramped valleys lose out. */
const THULO_PAHILE = [...JILLA].sort((a, b) => AREAS[b.id] - AREAS[a.id]);

/**
 * Name every missed district, nudging a label up, down or sideways when its box
 * would land on one already placed. Anything that still can't fit is left to the
 * side list and to hover — better a readable map than a pile of words.
 */
function naamRakh(bhetiyo: ReadonlySet<string>) {
  const CHAUDAI = 4.9; // rough width of one character
  const UCHAI = 10;
  const SARNE: Array<[number, number]> = [
    [0, 0], [0, -10], [0, 10], [-14, -10], [14, -10], [-14, 10], [14, 10],
    [0, -20], [0, 20], [-22, 0], [22, 0], [0, -30], [0, 30],
  ];

  const rakhiyo: Array<{ id: string; name: string; x: number; y: number; aadha: number }> = [];

  for (const jilla of THULO_PAHILE) {
    if (bhetiyo.has(jilla.id)) continue;
    const [cx, cy] = CENTERS[jilla.id];
    const aadha = (jilla.name.length * CHAUDAI) / 2;

    for (const [dx, dy] of SARNE) {
      const x = cx + dx;
      const y = cy + dy;
      const thokkincha = rakhiyo.some(
        (o) => Math.abs(o.y - y) < UCHAI && Math.abs(o.x - x) < o.aadha + aadha + 4,
      );
      if (!thokkincha) {
        rakhiyo.push({ id: jilla.id, name: jilla.name, x, y, aadha });
        break;
      }
    }
  }
  return rakhiyo;
}

export function Naksa({
  bhetiyo,
  khulyo,
  abhai,
  chamkeko,
  onChamak,
}: {
  bhetiyo: ReadonlySet<string>;
  /** True once the run is over — misses turn red and name themselves. */
  khulyo: boolean;
  /** The district just answered, for a one-off flash. */
  abhai: string | null;
  /** Singled out from the side list. */
  chamkeko: string | null;
  onChamak: (id: string | null) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const active = chamkeko ?? hover;

  const naamharu = useMemo(() => (khulyo ? naamRakh(bhetiyo) : []), [bhetiyo, khulyo]);

  const activeJilla = active ? JILLA_BY_ID.get(active) : undefined;
  const dekhaune = activeJilla && (khulyo || bhetiyo.has(activeJilla.id)) ? activeJilla : undefined;

  return (
    <svg
      id="naksa"
      className="naksa"
      viewBox={MAP_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Map of Nepal. ${bhetiyo.size} of ${JILLA.length} districts named.`}
      onMouseLeave={() => setHover(null)}
    >
      {JILLA.map((jilla) => (
        <Aakriti
          key={jilla.id}
          jilla={jilla}
          haal={bhetiyo.has(jilla.id) ? "bhetiyo" : khulyo ? "chhutyo" : "thaha-chhaina"}
          dhamilo={active !== null && active !== jilla.id}
          chamkeko={active === jilla.id}
          abhai={abhai === jilla.id}
          onHover={(id) => {
            setHover(id);
            onChamak(id);
          }}
        />
      ))}

      <g aria-hidden="true">
        {naamharu.map((n) =>
          n.id === dekhaune?.id ? null : (
            <text key={n.id} className="naam" x={n.x} y={n.y + 3}>
              {n.name}
            </text>
          ),
        )}

        {dekhaune && (
          <text
            className="naam thulo"
            x={CENTERS[dekhaune.id][0]}
            y={CENTERS[dekhaune.id][1] + 4}
            style={{ fill: bhetiyo.has(dekhaune.id) ? rang(dekhaune) : undefined }}
          >
            {dekhaune.name}
          </text>
        )}
      </g>
    </svg>
  );
}
