import fs from "node:fs/promises";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const DATA_FILE = "./data.json";
const DEFAULT_COUNT = 10;
const DEFAULT_DAYS_AGO = 365;

const ask = async (rl, question, fallback = "") => {
  const answer = (await rl.question(`${question}${fallback ? ` [${fallback}]` : ""}: `)).trim();
  return answer || fallback;
};

const askYesNo = async (rl, question, fallback = false) => {
  const answer = (await ask(rl, `${question} (y/N)`, fallback ? "y" : "n")).toLowerCase();
  return answer === "y" || answer === "yes";
};

const parseDate = (value, label) => {
  const date = moment(value, "YYYY-MM-DD", true);
  if (!date.isValid()) throw new Error(`${label} must use YYYY-MM-DD format.`);
  return date.startOf("day");
};

const makeUniqueDates = (count, start, end) => {
  const days = end.diff(start, "days") + 1;
  if (count > days) throw new Error(`You requested ${count} commits but the range only has ${days} days.`);

  const selected = new Set();
  while (selected.size < count) selected.add(random.int(0, days - 1));

  return [...selected]
    .sort((a, b) => a - b)
    .map((offset) => start.clone().add(offset, "days").hour(12).minute(random.int(0, 59)).second(random.int(0, 59)));
};

const commitOne = async (git, date) => {
  const data = { date: date.format() };
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data)}\n`, "utf8");
  await git.add([DATA_FILE]);
  await git.commit(`goGreen: ${date.format("YYYY-MM-DD")}`, { "--date": date.format() });
};

const main = async () => {
  const rl = readline.createInterface({ input, output });
  try {
    const git = simpleGit();
    const status = await git.status();
    const branch = status.current || "current branch";
    const remote = (await git.getRemotes(true)).find((item) => item.name === "origin");

    console.log("\n🌱 goGreen — contribution commit generator\n");
    console.log(`Repository branch: ${branch}`);
    console.log(`Origin: ${remote?.refs?.push || remote?.refs?.fetch || "not configured"}`);
    if (!remote) throw new Error("No origin remote is configured.");

    const count = Number(await ask(rl, "Number of commits", String(DEFAULT_COUNT)));
    if (!Number.isInteger(count) || count < 1 || count > 365) throw new Error("Number of commits must be an integer from 1 to 365.");

    const today = moment().startOf("day");
    const defaultStart = today.clone().subtract(DEFAULT_DAYS_AGO - 1, "days").format("YYYY-MM-DD");
    const start = parseDate(await ask(rl, "Start date", defaultStart), "Start date");
    const end = parseDate(await ask(rl, "End date", today.format("YYYY-MM-DD")), "End date");
    if (start.isAfter(end)) throw new Error("Start date must be before or equal to end date.");
    if (end.isAfter(today)) throw new Error("Future dates are not allowed.");

    const dates = makeUniqueDates(count, start, end);
    console.log(`\nPlanned ${dates.length} commits from ${start.format("YYYY-MM-DD")} to ${end.format("YYYY-MM-DD")}.`);
    if (dates.length <= 20) dates.forEach((date) => console.log(`  ${date.format()}`));

    if (!await askYesNo(rl, "Create these commits", false)) {
      console.log("Cancelled. No files, commits, or pushes were changed.");
      return;
    }

    for (const [index, date] of dates.entries()) {
      await commitOne(git, date);
      console.log(`Created ${index + 1}/${dates.length}: ${date.format("YYYY-MM-DD")}`);
    }

    if (await askYesNo(rl, "Push the new commits to origin", false)) {
      await git.push();
      console.log("Push completed successfully.");
    } else {
      console.log("Commits were created locally. Nothing was pushed.");
    }
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
};

main();
