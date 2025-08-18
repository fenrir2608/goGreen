import fs from "fs";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

// Ensure data.json exists
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({ date: null }, null, 2) + "\n", "utf8");
}

const makeCommits = async (n) => {
  if (n === 0) {
    console.log("✅ All commits done. Force pushing to main...");
    await git.push("origin", "main", { "--force": null });
    return;
  }

  // Random week/day in the past year
  const x = random.int(0, 54); // weeks
  const y = random.int(0, 6);  // days
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format("YYYY-MM-DD HH:mm:ss");

  // Overwrite data.json
  fs.writeFileSync(path, JSON.stringify({ date }, null, 2) + "\n", "utf8");
  console.log("📅 Commit on:", date);

  // Stage and commit only data.json with proper date
  await git.raw(["add", path]);
  await git.raw(["commit", "-m", date, "--date", date]);

  // Recurse for next commit
  await makeCommits(n - 1);
};

// Run 25 commits
makeCommits(25).catch(console.error);
