import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

export const markCommit = (x, y, callback) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = {
    date: date,
  };
  
  console.log(`Creating commit at ${x},${y} : ${date}`);

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }, callback);
  });
};

export const makeRandomCommits = (n) => {
  if (n === 0) return simpleGit().push();
  const x = random.int(0, 54);
  const y = random.int(0, 6);
  
  markCommit(x, y, () => makeRandomCommits(n - 1));
};

// Only run random commits if directly invoked
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
    makeRandomCommits(100);
}
