import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

const getRandom2025Date = () => {
  const dayOffset = random.int(0, 364);
  const hour = random.int(8, 22);
  const minute = random.int(0, 59);
  const second = random.int(0, 59);

  return moment("2025-01-01T00:00:00")
    .add(dayOffset, "days")
    .add(hour, "hours")
    .add(minute, "minutes")
    .add(second, "seconds")
    .format();
};

const makeCommits = async (totalCommits) => {
  console.log(`Starting ${totalCommits} commits for year 2025...`);

  for (let i = 1; i <= totalCommits; i++) {
    const date = getRandom2025Date();
    const data = { date };

    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(date, { "--date": date });

    if (i % 50 === 0 || i === totalCommits) {
      console.log(`[${i}/${totalCommits}] Latest commit date: ${date}`);
    }
  }

  console.log("All commits created locally. Pushing to origin...");
  await git.push("origin", "main");
  console.log("Done! All commits pushed successfully.");
};

makeCommits(700).catch((err) => {
  console.error("Error executing commits:", err);
});

