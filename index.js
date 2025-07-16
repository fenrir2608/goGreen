import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// 🔁 New date range: 15 Jan 2018 → 1 July 2025
const START_DATE = moment("2018-01-8");
const END_DATE = moment("2025-07-01");

const makeCommits = (n) => {
  if (n === 0) return simpleGit().push();

  const x = random.int(0, 388); // ~388 weeks total
  const y = random.int(0, 6);   // 0 to 6 days

  const date = START_DATE.clone().add(x, "w").add(y, "d");

  if (date.isAfter(END_DATE)) return makeCommits(n);  

  const formattedDate = date.format();
  console.log(formattedDate);

  const data = { date: formattedDate };

  jsonfile.writeFile(path, data, () => {
    simpleGit()
      .add([path])
      .commit(formattedDate, { "--date": formattedDate }, makeCommits.bind(this, --n));
  });
};

// 🟢 Number of commits (increase to fill contribution graph)
makeCommits(1000);
