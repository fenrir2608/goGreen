import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

import { generateRandomDates } from "./random-dates.js";

function readPositiveInteger(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return fallback;

  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value <= 0) {
    throw new TypeError(`${flag} must be followed by a positive integer`);
  }
  return value;
}

function git(args, options = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    env: { ...process.env, ...options.env },
  });
}

const count = readPositiveInteger("--count", 100);
const days = readPositiveInteger("--days", 365);
const shouldPush = process.argv.includes("--push");
const dates = generateRandomDates({ count, days });

if (!shouldPush) {
  console.log(dates.map((date) => date.toISOString()).join("\n"));
  console.log(`\nDry run: ${dates.length} random dates. Add --push to create and push commits.`);
  process.exit(0);
}

if (git(["status", "--porcelain"], { capture: true }).trim()) {
  throw new Error("Working tree must be clean before creating contribution commits");
}

for (const [index, date] of dates.entries()) {
  const timestamp = date.toISOString();
  writeFileSync(
    "data.json",
    `${JSON.stringify({ sequence: index + 1, date: timestamp }, null, 2)}\n`,
  );
  git(["add", "--", "data.json"]);
  git(["commit", "-m", `chore: activity ${index + 1}`, "--date", timestamp], {
    env: { GIT_COMMITTER_DATE: timestamp },
  });
}

git(["push"]);
console.log(`Created and pushed ${dates.length} randomly dated commits.`);
