import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const DATA_FILE_PATH = "./data.json";
const COMMIT_COUNT = 1000;

const START_DATE = moment().subtract(5, "year");  // Start date for commits (now - 5 years)
const END_DATE = moment();                        // End date for commits

const git = simpleGit();

const markCommit = async (weekOffset, dayOffset) => {
  try {
    const commitDate = START_DATE
      .clone()
      .add(weekOffset, "weeks")
      .add(dayOffset, "days")
      .format();

    const data = { date: commitDate };

    await jsonfile.writeFile(DATA_FILE_PATH, data);
    await git.add([DATA_FILE_PATH]);
    await git.commit(commitDate, { "--date": commitDate });
    await git.push();
  } catch (error) {
    console.error("Error making commit:", error);
  }
};


const makeCommits = async () => {
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.error("Not in a git repository. Please run 'git init' first.");
      return;
    }

    console.log(`Starting to create ${COMMIT_COUNT} commits between ${START_DATE.format("YYYY-MM-DD")} and ${END_DATE.format("YYYY-MM-DD")}`);
    
    const totalDays = END_DATE.diff(START_DATE, "days");
    
    for (let i = 0; i < COMMIT_COUNT; i++) {
      try {
        const randomDay = random.int(0, totalDays);
        const commitDate = START_DATE
          .clone()
          .add(randomDay, "days")
          .format();

        const data = { date: commitDate };
        
        console.log(`Creating commit ${i + 1}/${COMMIT_COUNT}: ${commitDate}`);

        await jsonfile.writeFile(DATA_FILE_PATH, data);
        await git.add([DATA_FILE_PATH]);
        await git.commit(commitDate, { "--date": commitDate });
        
        await new Promise(resolve => setTimeout(resolve, 10));
        
      } catch (error) {
        console.error(`Error creating commit ${i + 1}:`, error.message);
      }
    }

    console.log("All commits completed. Pushing to remote...");
    await git.push();
    console.log("Successfully pushed all commits!");
    
  } catch (error) {
    console.error("Error in makeCommits:", error.message);
  }
};

makeCommits();