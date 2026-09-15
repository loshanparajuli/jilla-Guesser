/**
 * Regenerates lib/naksa-data.ts from data/nepal-map-source.html.
 *
 * The source SVG stores every district as a <polygon> with ~700 points at 0.1
 * unit resolution — 630KB of coordinates. We run Douglas-Peucker at EPS user
 * units (the map renders at roughly 1:1, so the error stays sub-pixel) which
 * gets it under 100KB, and precompute an area-weighted centroid per district
 * for label placement.
 *
 * Usage: npm run generate:map
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EPS = 0.3;

function perpendicularDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lenSq));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

function simplify(points, eps) {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  const first = points[0];
  const last = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  if (maxDist <= eps) return [first, last];
  return simplify(points.slice(0, index + 1), eps)
    .slice(0, -1)
    .concat(simplify(points.slice(index), eps));
}

function polygonArea(points) {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    sum += x0 * y1 - x1 * y0;
  }
  return Math.abs(sum) / 2;
}

function centroid(points) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 1e-6) {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  }
  return [cx / (6 * area), cy / (6 * area)];
}

const source = readFileSync(join(ROOT, "data/nepal-map-source.html"), "utf8");
const polygon = /<polygon[^>]*?id="([^"]+)"[^>]*?points="([\s\S]*?)"/g;

const shapes = {};
const centers = {};
const areas = {};
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
let match;

while ((match = polygon.exec(source))) {
  const id = match[1].replace(/\s+/g, "-");
  const nums = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
  const points = [];
  for (let i = 0; i < nums.length; i += 2) points.push([nums[i], nums[i + 1]]);

  const reduced = simplify(points, EPS);
  shapes[id] = reduced.map(([x, y]) => `${+x.toFixed(1)},${+y.toFixed(1)}`).join(" ");
  const [cx, cy] = centroid(reduced);
  centers[id] = [+cx.toFixed(1), +cy.toFixed(1)];
  areas[id] = +polygonArea(reduced).toFixed(0);

  for (const [x, y] of reduced) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
}

const viewBox = [
  Math.floor(minX) - 2,
  Math.floor(minY) - 2,
  Math.ceil(maxX - minX) + 4,
  Math.ceil(maxY - minY) + 4,
].join(" ");

const out = [
  "// Auto-generated from the source SVG map of Nepal (forked from rubekk/SVG-Map-of-Nepal).",
  `// Polygons are Douglas-Peucker simplified at eps=${EPS} user units (sub-pixel at render size).`,
  "// Run `npm run generate:map` to rebuild.",
  "",
  `export const MAP_VIEWBOX = "${viewBox}";`,
  "",
  "export const SHAPES: Record<string, string> = {",
  ...Object.entries(shapes).map(([k, v]) => `  "${k}": "${v}",`),
  "};",
  "",
  "export const CENTERS: Record<string, [number, number]> = {",
  ...Object.entries(centers).map(([k, v]) => `  "${k}": [${v[0]}, ${v[1]}],`),
  "};",
  "",
  "/** Polygon area in user units — labels for larger districts are drawn first and bigger. */",
  "export const AREAS: Record<string, number> = {",
  ...Object.entries(areas).map(([k, v]) => `  "${k}": ${v},`),
  "};",
  "",
].join("\n");

writeFileSync(join(ROOT, "lib/naksa-data.ts"), out);
console.log(`Wrote lib/naksa-data.ts — ${Object.keys(shapes).length} districts, ${(out.length / 1024).toFixed(0)}KB`);
