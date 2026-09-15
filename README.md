# Jilla Guesser

Name all **77 districts of Nepal** on a blank map before the clock runs out.
One screen, no scrolling, no menus. Type and the map fills in.

Play: https://loshanparajuli.github.io/jilla-Guesser/

## How it plays

- **Type, don't click.** The clock starts on your first correct answer. Nothing to set up.
- **Spellings are forgiven.** `Tanahu`, `Kavre`, `Sindhupalchok`, `Nawalpur`, `Bardia`
  all land, and so do plain typos — but input that fits two real districts is never
  guessed for you. Type `oolpa` and it asks whether you meant Dolpa or Rolpa.
- **A hint when you're actually stuck.** Miss three times *and* go ten seconds without
  scoring, and the district you were reaching for appears in the box as a greyed-out
  placeholder. Score once and the counter resets. It never fires early, and it never
  names something you've already found.
- **The map fills in by province**, with a running count and a scrollable list of
  everything you have named down the right-hand side.
- **Misses are revealed.** When the clock stops, every district you didn't name turns
  red and labels itself in place. Hover any of them — on the map or in the list — to
  single it out.
- Four clocks: 3:00, 5:00, 10:00, and ∞ for no clock at all. Best score per clock is
  kept in `localStorage`.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # matching, hints and map data
npm run build      # static export to ./out
```

## The source

Next.js static export, React, and one hand-written stylesheet. No CSS framework, no
runtime dependencies beyond React. Class names are the game's own vocabulary —
`naksa` map, `jilla` district, `pradesh` province, `ghadi` clock, `bakas` box,
`sanket` hint, `bhetiyo` found, `chhutyo` missed — so the markup reads like the game.

| Path | What's in it |
| --- | --- |
| `app/page.tsx` | The whole screen: header, map, box, rail, footer. |
| `app/globals.css` | Every style there is. |
| `components/naksa.tsx` | The map, and the label placement for misses. |
| `components/naam-bakas.tsx` | The box you type into, and the hint timing. |
| `components/dayan.tsx` | The right-hand rail. |
| `lib/jilla.ts` | The 77 districts: name, province, accepted spellings. |
| `lib/milaune.ts` | Text → district. Exact spellings first, then a bounded Levenshtein pass that refuses to choose between equally-near districts. `najikkoJilla` is the far more forgiving version used only for hints. |
| `lib/khel.ts` | Game state. The clock runs off a wall-clock deadline, so a backgrounded tab can't gain time. |
| `lib/naksa-data.ts` | **Generated.** Polygons, label anchors, areas. |
| `scripts/generate-map-data.mjs` | Rebuilds the above from `data/nepal-map-source.html`. |

### The map data

The source SVG stores each district as a polygon of ~700 points at 0.1-unit
resolution — 630KB of coordinates. `npm run generate:map` runs Douglas–Peucker
simplification at 0.3 user units (sub-pixel at the size the map renders), which brings
it under 100KB, and precomputes an area-weighted centroid per district for labels.
Edit the source SVG, re-run the script, commit the result.

## Credits

District outlines forked from [rubekk/SVG-Map-of-Nepal](https://github.com/rubekk/SVG-Map-of-Nepal).
