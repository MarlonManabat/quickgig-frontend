import fs from "node:fs";

const path = "src/data/ph/cities.json";

if (!fs.existsSync(path)) {
  console.error("[assert-ph-geo] Missing:", path);
  process.exit(1);
}

const raw = fs.readFileSync(path, "utf8");

let rows;
try {
  rows = JSON.parse(raw);
} catch (error) {
  console.error("[assert-ph-geo] Invalid JSON:", error instanceof Error ? error.message : error);
  process.exit(1);
}

if (!Array.isArray(rows) || rows.length === 0) {
  console.error("[assert-ph-geo] Invalid or empty dataset");
  process.exit(1);
}

const hasQC = rows.some(
  (row) =>
    row &&
    typeof row === "object" &&
    typeof row.city === "string" &&
    /quezon city/i.test(row.city),
);

if (!hasQC) {
  console.error('[assert-ph-geo] Dataset must include a city named "Quezon City"');
  process.exit(1);
}
