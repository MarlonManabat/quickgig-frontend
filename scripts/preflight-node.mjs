#!/usr/bin/env node
import fs from "node:fs";

const wantNode = fs.existsSync(".nvmrc")
  ? fs.readFileSync(".nvmrc", "utf8").trim()
  : null;

const engines = JSON.parse(fs.readFileSync("package.json", "utf8")).engines || {};
const rangeNode = engines.node || ">=20 <21";
const rangeNpm  = engines.npm  || ">=10 <11";

function parseMajorMinor(v){ const m = v.match(/^v?(\d+)\.(\d+)\./); return m ? [Number(m[1]), Number(m[2])] : [0,0]; }

const nodeV = process.version;
const [nodeMajor] = parseMajorMinor(nodeV);

const npmV = process.env.npm_config_user_agent?.match(/npm\/([\d.]+)/)?.[1] || "";
const npmMajor = Number(npmV.split(".")[0] || 0);

// Simple range checks (keep light—no semver dep)
const nodeOk = nodeMajor >= 20 && nodeMajor < 21;
const npmOk  = npmMajor >= 10 && npmMajor < 11;

if (!nodeOk || !npmOk) {
  console.error("");
  console.error("❌ Node/npm version mismatch.");
  console.error(`   Detected: node ${nodeV}, npm ${npmV}`);
  console.error(`   Required: node ${rangeNode}, npm ${rangeNpm}`);
  if (wantNode) console.error(`   .nvmrc pinned: ${wantNode}`);
  console.error("");
  console.error("Fix: nvm use 20  (or)  volta install node@20.17.0 npm@10.8.2");
  process.exit(1);
}

if (wantNode && !nodeV.startsWith("v"+wantNode)) {
  console.warn(`⚠️  Node ${nodeV} != .nvmrc ${wantNode}. Consider 'nvm use'.`);
}
