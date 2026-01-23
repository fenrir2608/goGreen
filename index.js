import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs";
import readline from "readline";

const dataPath = "./data.json";
const configPath = "./config.json";
const progressPath = "./progress.json";

// Load configuration
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Function to ask user questions
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Check for existing progress and handle resume/reset
async function handleProgress() {
  if (fs.existsSync(progressPath)) {
    const savedProgress = JSON.parse(fs.readFileSync(progressPath, "utf8"));
    
    console.log("\n╔═══════════════════════════════════════╗");
    console.log("║   📂 Previous Session Detected        ║");
    console.log("╚═══════════════════════════════════════╝");
    console.log(`\nProgress found: ${savedProgress.completed}/${config.totalCommits} commits completed`);
    console.log(`Remaining: ${config.totalCommits - savedProgress.completed} commits\n`);
    
    console.log("What would you like to do?\n");
    console.log("  [1] Resume - Continue from where you left off");
    console.log("  [2] Reset - Delete progress and start fresh");
    console.log("  [3] Cancel - Exit without doing anything\n");
    
    const choice = await askQuestion("Enter choice (1/2/3): ");
    
    if (choice === "2") {
      console.log("\n🗑️  Resetting progress...");
      
      // Delete progress file
      fs.unlinkSync(progressPath);
      console.log("✓ Progress file deleted");
      
      // Ask about uncommitted local commits
      console.log("\n⚠️  Do you want to reset local commits too?");
      console.log("    This will remove any uncommitted/unpushed commits.");
      
      const resetCommits = await askQuestion("Reset local commits? (y/N): ");
      
      if (resetCommits.toLowerCase() === "y") {
        try {
          const git = simpleGit();
          
          // Check if we have a remote
          try {
            await git.raw(['rev-parse', '--verify', 'origin/main']);
            // Reset to remote
            await git.reset(['--hard', 'origin/main']);
            console.log("✓ Reset to match remote repository");
          } catch {
            // No remote or origin/main doesn't exist, just clean up
            console.log("⚠️  No remote found. Keeping local state.");
          }
        } catch (error) {
          console.log("⚠️  Could not reset commits:", error.message);
        }
      }
      
      console.log("\n✅ Reset complete! Starting fresh...\n");
      return { completed: 0, usedDates: [] };
      
    } else if (choice === "3") {
      console.log("\n👋 Exiting...\n");
      process.exit(0);
    } else {
      console.log("\n▶️  Resuming from commit ${savedProgress.completed}...\n");
      return savedProgress;
    }
  }
  
  return { completed: 0, usedDates: [] };
}

// Load or initialize progress
let progress;

console.log("=== goGreen Configuration ===");
console.log(`Mode: ${config.mode}`);
console.log(`Year: ${config.year}`);
console.log(`Total Commits: ${config.totalCommits}`);
console.log(`Density Type: ${config.commitDensity.type}`);
if (config.commitDensity.type === "random") {
  console.log(`Density Range: ${config.commitDensity.min}-${config.commitDensity.max} commits per day`);
} else {
  console.log(`Fixed Density: ${config.commitDensity.fixed} commits per day`);
}
console.log("============================\n");

// Ensure we're on main branch and it's set up
async function setupBranch() {
  const git = simpleGit();
  try {
    const branches = await git.branch();
    if (!branches.current) {
      await git.checkoutLocalBranch("main");
      console.log("✓ Created and checked out 'main' branch");
    } else if (branches.current !== "main" && branches.current !== "master") {
      await git.checkout("main").catch(() => git.checkoutLocalBranch("main"));
      console.log("✓ Switched to 'main' branch");
    }
  } catch (error) {
    console.log("⚠️ Branch setup warning:", error.message);
  }
}

// Generate unique date
function generateUniqueDate(usedDates) {
  let date;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    if (config.mode === "random") {
      const startDate = moment(`${config.year}-01-01`);
      const endDate = moment(`${config.year}-12-31`);
      const daysDiff = endDate.diff(startDate, "days");
      const randomDays = random.int(0, daysDiff);
      date = moment(`${config.year}-01-01`).add(randomDays, "days").format("YYYY-MM-DD");
    } else if (config.mode === "consecutive") {
      // Consecutive mode: use dates within the specified year
      const startDate = moment(`${config.year}-01-01`);
      const dayIndex = Math.floor(progress.completed / (config.commitDensity.fixed || 1));
      date = startDate.add(dayIndex, "days").format("YYYY-MM-DD");
    }
    attempts++;
  } while (usedDates.includes(date) && attempts < maxAttempts && config.mode === "random");

  return date;
}

// Get date from pattern
function getPatternDate(index) {
  const coord = config.pattern.coordinates[index];
  if (coord) {
    const startOfYear = moment(`${config.year}-01-01`);
    const firstSunday = startOfYear.clone().day(0);
    if (firstSunday.year() < config.year) {
      firstSunday.add(7, "days");
    }
    return firstSunday.add(coord.week, "weeks").add(coord.day, "days").format("YYYY-MM-DD");
  }
  return null;
}

// Make commits with proper density and batching
async function makeCommits() {
  await setupBranch();
  
  const git = simpleGit();
  const batchSize = 50; // Push every 50 commits
  
  while (progress.completed < config.totalCommits) {
    try {
      let date;
      
      if (config.mode === "pattern") {
        date = getPatternDate(progress.completed);
        if (!date) {
          console.log("⚠️ Pattern coordinates exhausted, using random date");
          date = generateUniqueDate(progress.usedDates);
        }
      } else {
        date = generateUniqueDate(progress.usedDates);
      }

      // Determine commits for this date based on density
      let commitsForThisDate = 1;
      if (config.mode !== "pattern") {
        commitsForThisDate =
          config.commitDensity.type === "random"
            ? random.int(config.commitDensity.min, config.commitDensity.max)
            : config.commitDensity.fixed || 1;
      }

      // Create multiple commits for the same date if density > 1
      for (let i = 0; i < commitsForThisDate && progress.completed < config.totalCommits; i++) {
        const commitDateTime = moment(date)
          .add(random.int(0, 23), "hours")
          .add(random.int(0, 59), "minutes")
          .format();

        const data = { 
          date: commitDateTime,
          commit: progress.completed + 1,
          total: config.totalCommits 
        };

        // Write data file
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        // Make commit
        await git.add([dataPath]);
        await git.commit(commitDateTime, { "--date": commitDateTime });

        progress.completed++;
        console.log(`[${progress.completed}/${config.totalCommits}] ${commitDateTime}`);

        // Save progress
        if (!progress.usedDates.includes(date)) {
          progress.usedDates.push(date);
        }
        fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

        // Batch push every 50 commits
        if (progress.completed % batchSize === 0) {
          console.log(`\n📤 Pushing commits ${progress.completed - batchSize + 1}-${progress.completed}...`);
          try {
            await git.push("origin", "main");
            console.log("✅ Batch pushed successfully\n");
          } catch (pushError) {
            console.log("⚠️ Push failed, will retry at next batch:", pushError.message);
          }
        }
      }

    } catch (error) {
      console.error(`\n❌ Error at commit ${progress.completed}:`, error.message);
      console.log("💾 Progress saved. You can resume by running the script again.\n");
      process.exit(1);
    }
  }

  // Final push for remaining commits
  console.log("\n📤 Pushing final commits...");
  try {
    await git.push("origin", "main");
    console.log("✅ All commits pushed successfully!");
    
    // Clean up progress file on success
    if (fs.existsSync(progressPath)) {
      fs.unlinkSync(progressPath);
    }
    
    console.log("\n🎉 Done! Check your GitHub profile!");
    console.log(`   Created ${config.totalCommits} commits for year ${config.year}\n`);
  } catch (pushError) {
    console.error("❌ Final push failed:", pushError.message);
    console.log("\n💡 Try manually pushing:");
    console.log("   git push origin main\n");
    process.exit(1);
  }
}

// Validation
function validateConfig() {
  if (!config.year || config.year < 2000 || config.year > 2030) {
    console.error("❌ Invalid year in config. Must be between 2000-2030");
    process.exit(1);
  }
  
  if (!config.totalCommits || config.totalCommits < 1) {
    console.error("❌ Invalid totalCommits. Must be at least 1");
    process.exit(1);
  }
  
  if (config.commitDensity.type === "random") {
    if (config.commitDensity.min > config.commitDensity.max) {
      console.error("❌ Invalid density range. Min cannot be greater than max");
      process.exit(1);
    }
  }
  
  console.log("✓ Configuration validated\n");
}

// Run
async function run() {
  validateConfig();
  progress = await handleProgress();
  await makeCommits();
}

run().catch((error) => {
  console.error("\n❌ Fatal error:", error.message);
  console.log("💾 Progress has been saved. Run the script again to resume.\n");
  process.exit(1);
});
