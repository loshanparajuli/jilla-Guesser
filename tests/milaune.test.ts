import { test } from "node:test";
import assert from "node:assert/strict";

import { JAMMA, JILLA } from "../lib/jilla.ts";
import { aruBaaki, milau, najikkoJilla, normalize, shuruHune } from "../lib/milaune.ts";

const nothing = new Set<string>();

test("every district answers to its own name", () => {
  for (const jilla of JILLA) {
    assert.deepEqual(milau(jilla.name), { kind: "pakka", id: jilla.id }, jilla.name);
  }
});

test("every alias answers to its district", () => {
  for (const jilla of JILLA) {
    for (const alias of jilla.aliases) {
      const milan = milau(alias);
      assert.ok(milan.kind === "pakka" || milan.kind === "najik", `${alias} matched nothing`);
      if (milan.kind === "pakka" || milan.kind === "najik") assert.equal(milan.id, jilla.id, alias);
    }
  }
});

test("case, spacing and punctuation are ignored", () => {
  assert.deepEqual(milau("RUKUM EAST"), { kind: "pakka", id: "rukum-east" });
  assert.deepEqual(milau("  kathmandu  "), { kind: "pakka", id: "kathmandu" });
  assert.deepEqual(milau("Nawalparasi (East)"), { kind: "pakka", id: "nawalparasi-east" });
  assert.equal(normalize("Rukum  East!"), "rukumeast");
});

test("a correct spelling is never stolen by a lookalike", () => {
  assert.deepEqual(milau("dolpa"), { kind: "pakka", id: "dolpa" });
  assert.deepEqual(milau("rolpa"), { kind: "pakka", id: "rolpa" });
  assert.deepEqual(milau("bara"), { kind: "pakka", id: "bara" });
  assert.deepEqual(milau("rukum west"), { kind: "pakka", id: "rukum-west" });
});

test("unambiguous typos are forgiven", () => {
  assert.deepEqual(milau("kathmandau"), { kind: "najik", id: "kathmandu" });
  assert.deepEqual(milau("sindhupalchock"), { kind: "najik", id: "sindhupalchowk" });
  assert.deepEqual(milau("rupandeh"), { kind: "najik", id: "rupandehi" });
});

test("input that fits two districts is refused, not guessed", () => {
  const milan = milau("oolpa");
  assert.equal(milan.kind, "dubidha");
  if (milan.kind === "dubidha") assert.deepEqual([...milan.ids].sort(), ["dolpa", "rolpa"]);
});

test("nonsense, bare stems and very short input match nothing", () => {
  assert.deepEqual(milau("zzzzqqq"), { kind: "kehi-chhaina" });
  assert.deepEqual(milau("   "), { kind: "kehi-chhaina" });
  assert.equal(milau("rukum").kind, "kehi-chhaina");
  assert.deepEqual(milau("dan"), { kind: "kehi-chhaina" });
  assert.deepEqual(milau("dang"), { kind: "pakka", id: "dang" });
});

test("no district name is a prefix of another, so auto-submit is safe", () => {
  for (const jilla of JILLA) {
    assert.equal(aruBaaki(jilla.name, jilla.id), false, `${jilla.name} is a prefix of another`);
  }
  assert.equal(aruBaaki("kath"), true);
});

test("a half-typed stem offers the districts it could become", () => {
  assert.deepEqual(shuruHune("rukum").sort(), ["rukum-east", "rukum-west"]);
  assert.deepEqual(shuruHune("nawalparasi").sort(), ["nawalparasi-east", "nawalparasi-west"]);
  assert.deepEqual(shuruHune("ka"), []);
});

// ── the hint ──────────────────────────────────────────────────────────────

test("the hint reaches further than the matcher does", () => {
  // Too mangled for milau to take, but obvious to anyone reading it.
  for (const [typed, meant] of [
    ["tanahoo", "Tanahun"],
    ["kapilbastooo", "Kapilvastu"],
    ["argakanchee", "Arghakhanchi"],
    ["solokhumboo", "Solukhumbu"],
    ["kanchunpoor", "Kanchanpur"],
    ["myaagdee", "Myagdi"],
  ]) {
    assert.equal(milau(typed).kind, "kehi-chhaina", `${typed} should not be auto-accepted`);
    assert.equal(najikkoJilla(typed, nothing), meant, typed);
  }
});

test("the hint never points at a district already found", () => {
  assert.equal(najikkoJilla("tanahoo", nothing), "Tanahun");
  assert.equal(najikkoJilla("tanahoo", new Set(["tanahun"])), null);
});

test("the hint stays quiet on a correct spelling — that is not a hint", () => {
  assert.equal(najikkoJilla("Kaski", nothing), null);
});

test("the hint refuses ties and gibberish", () => {
  assert.equal(najikkoJilla("oolpa", nothing), null);
  assert.equal(najikkoJilla("qqqqqqqq", nothing), null);
  assert.equal(najikkoJilla("abc", nothing), null);
});

test("the dataset is the whole country, once each", () => {
  assert.equal(JAMMA, 77);
  assert.equal(new Set(JILLA.map((j) => j.id)).size, 77);
  assert.equal(new Set(JILLA.map((j) => j.name)).size, 77);
});
