// Read-only proof that D3 preserves the reviewed verification pipeline.
// Run from the repository root after npm ci; the historical Git object is needed.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import yaml from "js-yaml";

const baseline = "c7cc59ad394c61a9e822183bd2d7e34791dc869c";
const path = ".github/workflows/checks.yml";
const before = yaml.load(execFileSync("git", ["show", `${baseline}:${path}`], { encoding: "utf8" }));
const after = yaml.load(readFileSync(path, "utf8"));
const pins = {
  "actions/checkout": "3d3c42e5aac5ba805825da76410c181273ba90b1",
  "actions/setup-node": "949feb2413d6458794dcd2491c4babbbce0c15c1",
  "actions/setup-python": "6d4fd22b20465ccc0f7354476588e8df7c9ca0e0",
  "actions/upload-artifact": "cf430e030ddbb5b0abf93d22962f4752f3646cd9",
};
before.on.push = { branches: ["main"] };
let actions = 0;
for (const step of before.jobs.verify.steps) {
  if (!step.uses) continue;
  const name = step.uses.split("@")[0];
  assert(Object.hasOwn(pins, name), `Unexpected existing action: ${name}`);
  step.uses = `${name}@${pins[name]}`;
  actions += 1;
}
assert.equal(actions, 4);
assert.deepEqual(after, before);
assert.equal(JSON.parse(readFileSync("vercel.json", "utf8")).git.deploymentEnabled, false);
console.log("D3 parsed workflow differs only by the main push filter and four reviewed pins; deployment hold remains enabled.");
