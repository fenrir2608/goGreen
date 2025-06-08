import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';

const path = './data.json';

const markCommit = (date, callback) => {
  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { '--date': date }, callback);
  });
};

const createCommitPattern = () => {
  const commits = [];
  const startDate = moment().subtract(1, 'year');

  // Create different types of patterns for a more realistic graph
  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = startDate.clone().add(week, 'weeks').add(day, 'days');

      // Skip weekends sometimes for more realistic pattern (optional)
      if (day === 0 || day === 6) {
        if (random.float() < 0.7) continue; // 70% chance to skip weekends
      }

      // Create different intensity patterns
      let commitsForDay = 0;
      const intensity = random.float();

      if (intensity < 0.3) {
        // 30% chance: No commits (rest days)
        commitsForDay = 0;
      } else if (intensity < 0.6) {
        // 30% chance: Light activity (1-2 commits)
        commitsForDay = random.int(1, 2);
      } else if (intensity < 0.85) {
        // 25% chance: Medium activity (3-5 commits)
        commitsForDay = random.int(3, 5);
      } else {
        // 15% chance: Heavy activity (6-10 commits)
        commitsForDay = random.int(6, 10);
      }

      // Create streaks occasionally
      if (week > 0 && random.float() < 0.1) {
        // 10% chance for streak
        const streakLength = random.int(3, 7);
        for (
          let streakDay = 0;
          streakDay < streakLength && day + streakDay < 7;
          streakDay++
        ) {
          const streakDate = currentDate.clone().add(streakDay, 'days');
          const streakCommits = random.int(2, 6);
          for (let i = 0; i < streakCommits; i++) {
            commits.push(streakDate.format());
          }
        }
      } else {
        // Regular commits for the day
        for (let i = 0; i < commitsForDay; i++) {
          commits.push(currentDate.format());
        }
      }
    }
  }

  // Shuffle commits to make timing more random
  return commits.sort(() => random.float() - 0.5);
};

const makeCommits = (commitDates, index = 0) => {
  if (index >= commitDates.length) {
    console.log(`✅ Created ${commitDates.length} commits successfully!`);
    return simpleGit().push();
  }

  const date = commitDates[index];
  console.log(`📝 Creating commit ${index + 1}/${commitDates.length}: ${date}`);

  markCommit(date, () => {
    // Add small delay to avoid overwhelming git
    setTimeout(() => {
      makeCommits(commitDates, index + 1);
    }, 50);
  });
};

// Generate the commit pattern and start creating commits
console.log('🚀 Generating GitHub contribution pattern...');
const commitDates = createCommitPattern();
console.log(`📊 Generated ${commitDates.length} commits over the past year`);
console.log(
  '🎯 Pattern includes: streaks, varying intensities, and realistic work patterns'
);
makeCommits(commitDates);
