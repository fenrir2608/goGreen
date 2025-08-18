import fs from "fs";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({ date: null }, null, 2) + "\n", "utf8");
}

const makeCommits = async (n) => {
  if (n === 0) {
    console.log("✅ All commits done. Pushing to main...");
    await git.push("origin", "main");
    return;
  }

  const x = random.int(0, 54); // weeks
  const y = random.int(0, 6);  // days
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format("YYYY-MM-DD HH:mm:ss");

  fs.writeFileSync(path, JSON.stringify({ date }, null, 2) + "\n", "utf8");
  console.log("📅 Commit on:", date);

  await git.raw(["add", path]);
  await git.raw(["commit", "-m", date, "--date", date]);

  await makeCommits(n - 1);
};

makeCommits(50).catch(console.error);
