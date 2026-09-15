import { test } from "node:test";
import assert from "node:assert/strict";

import { JILLA } from "../lib/jilla.ts";
import { AREAS, CENTERS, MAP_VIEWBOX, SHAPES } from "../lib/naksa-data.ts";

const [vx, vy, vw, vh] = MAP_VIEWBOX.split(" ").map(Number);

test("every district has a shape, a centre and an area", () => {
  for (const jilla of JILLA) {
    assert.ok(SHAPES[jilla.id], `${jilla.id} has no polygon`);
    assert.ok(CENTERS[jilla.id], `${jilla.id} has no centre`);
    assert.ok(AREAS[jilla.id] > 0, `${jilla.id} has no area`);
  }
});

test("the map carries no shapes the game does not know about", () => {
  const known = new Set(JILLA.map((j) => j.id));
  for (const id of Object.keys(SHAPES)) assert.ok(known.has(id), `orphan shape: ${id}`);
});

test("every label anchor sits inside the viewBox", () => {
  for (const [id, [x, y]] of Object.entries(CENTERS)) {
    assert.ok(x >= vx && x <= vx + vw, `${id} centre x out of frame`);
    assert.ok(y >= vy && y <= vy + vh, `${id} centre y out of frame`);
  }
});

test("polygons are well formed", () => {
  for (const [id, points] of Object.entries(SHAPES)) {
    const pairs = points.split(" ");
    assert.ok(pairs.length >= 3, `${id} has fewer than 3 points`);
    for (const pair of pairs) {
      const [x, y] = pair.split(",").map(Number);
      assert.ok(Number.isFinite(x) && Number.isFinite(y), `${id} has a bad point: ${pair}`);
    }
  }
});
