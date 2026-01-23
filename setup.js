import readline from "readline";
import fs from "fs";
import { spawn, execSync } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const config = {
  mode: "random",
  year: 2024,
  totalCommits: 400,
  commitDensity: {
    type: "random",
    min: 1,
    max: 5,
  },
  pattern: {
    enabled: false,
    design: "custom",
    coordinates: [],
  },
};

console.log("\n╔═══════════════════════════════════════╗");
console.log("║     🌱 goGreen Setup Wizard 🌱       ║");
console.log("╔═══════════════════════════════════════╗\n");
console.log("Answer a few simple questions to configure your GitHub commits!\n");

function askQuestion(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function setup() {
  // Question 1: Mode
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1️⃣  How do you want to distribute commits?");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   [1] Random - Spread randomly throughout the year");
  console.log("   [2] Consecutive - Build a streak (commits every day)");
  console.log("   [3] Pattern - Custom design (advanced)\n");

  const modeChoice = await askQuestion("Enter choice (1/2/3): ");

  if (modeChoice === "1") {
    config.mode = "random";
  } else if (modeChoice === "2") {
    config.mode = "consecutive";
  } else if (modeChoice === "3") {
    config.mode = "pattern";
    config.pattern.enabled = true;

    // Pattern selection
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   Choose a pattern design:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   [1] Vertical Stripes");
    console.log("   [2] Horizontal Stripes");
    console.log("   [3] Checkerboard");
    console.log("   [4] Diagonal Lines");
    console.log("   [5] Border Frame");
    console.log("   [6] Heart Shape");
    console.log("   [7] Random Pattern (surprise me!)");
    console.log("   [8] Custom (enter your own coordinates)\n");

    const patternChoice = await askQuestion("Enter pattern choice (1-8): ");
    
    let coordinates = [];
    
    switch (patternChoice) {
      case "1": // Vertical Stripes
        config.pattern.design = "vertical-stripes";
        for (let week = 0; week < 52; week += 3) {
          for (let day = 0; day < 7; day++) {
            coordinates.push({ week, day });
          }
        }
        break;
        
      case "2": // Horizontal Stripes
        config.pattern.design = "horizontal-stripes";
        for (let week = 0; week < 52; week++) {
          for (let day = 0; day < 7; day += 2) {
            coordinates.push({ week, day });
          }
        }
        break;
        
      case "3": // Checkerboard
        config.pattern.design = "checkerboard";
        for (let week = 0; week < 52; week++) {
          for (let day = 0; day < 7; day++) {
            if ((week + day) % 2 === 0) {
              coordinates.push({ week, day });
            }
          }
        }
        break;
        
      case "4": // Diagonal Lines
        config.pattern.design = "diagonal";
        for (let week = 0; week < 52; week++) {
          for (let day = 0; day < 7; day++) {
            if ((week - day) % 3 === 0) {
              coordinates.push({ week, day });
            }
          }
        }
        break;
        
      case "5": // Border Frame
        config.pattern.design = "border";
        for (let week = 0; week < 52; week++) {
          for (let day = 0; day < 7; day++) {
            if (week === 0 || week === 51 || day === 0 || day === 6) {
              coordinates.push({ week, day });
            }
          }
        }
        break;
        
      case "6": // Heart Shape
        config.pattern.design = "heart";
        const heart = [
          [20, 1], [21, 1], [24, 1], [25, 1],
          [19, 2], [22, 2], [23, 2], [26, 2],
          [19, 3], [20, 3], [21, 3], [22, 3], [23, 3], [24, 3], [25, 3], [26, 3],
          [19, 4], [20, 4], [21, 4], [22, 4], [23, 4], [24, 4], [25, 4], [26, 4],
          [20, 5], [21, 5], [22, 5], [23, 5], [24, 5], [25, 5],
          [21, 6], [22, 6], [23, 6], [24, 6],
          [22, 7], [23, 7],
        ];
        coordinates = heart.map(([week, day]) => ({ week, day }));
        break;
        
      case "7": // Random Pattern
        config.pattern.design = "random";
        const density = Math.random() * 0.4 + 0.3; // 30-70% filled
        for (let week = 0; week < 52; week++) {
          for (let day = 0; day < 7; day++) {
            if (Math.random() < density) {
              coordinates.push({ week, day });
            }
          }
        }
        break;
        
      case "8": // Custom
        config.pattern.design = "custom";
        console.log("\n💡 Enter coordinates as: week,day (e.g., 0,0 or 10,3)");
        console.log("   Week: 0-51 (columns), Day: 0-6 (rows, 0=Sunday)");
        console.log("   Type 'done' when finished\n");
        
        let input = "";
        while (input !== "done") {
          input = await askQuestion("Enter coordinate (or 'done'): ");
          if (input !== "done") {
            const [week, day] = input.split(",").map((n) => parseInt(n.trim()));
            if (!isNaN(week) && !isNaN(day)) {
              coordinates.push({ week, day });
            }
          }
        }
        break;
        
      default:
        config.pattern.design = "random";
        const defaultDensity = 0.5;
        for (let week = 0; week < 52; week++) {
          for (let day = 0; day < 7; day++) {
            if (Math.random() < defaultDensity) {
              coordinates.push({ week, day });
            }
          }
        }
    }
    
    config.pattern.coordinates = coordinates;
    config.totalCommits = coordinates.length;
    
    console.log(`\n✓ Pattern created with ${coordinates.length} commits!`);
  }

  // Question 2: Year
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("2️⃣  Which year do you want to fill?");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   Examples: 2021, 2022, 2023, 2024, 2025\n");

  const yearInput = await askQuestion("Enter year: ");
  config.year = parseInt(yearInput) || 2024;

  // Question 3: Total Commits (skip if pattern mode)
  if (config.mode !== "pattern") {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("3️⃣  How many total commits do you want?");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   💡 Tip: 365 = one per day, 500+ = very active\n");

    const commitsInput = await askQuestion("Enter number of commits: ");
    config.totalCommits = parseInt(commitsInput) || 400;
  }

  // Question 4: Density
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("4️⃣  How should commits be distributed per day?");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   [1] Random (varies - looks natural)");
  console.log("   [2] Fixed (same amount every day)\n");

  const densityChoice = await askQuestion("Enter choice (1/2): ");

  if (densityChoice === "1") {
    config.commitDensity.type = "random";
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("   Set the range for commits per day");
    console.log("   💡 1-5 means light to dark green squares\n");

    const minCommits = await askQuestion("Minimum commits per day (1-10): ");
    const maxCommits = await askQuestion("Maximum commits per day (1-10): ");

    config.commitDensity.min = parseInt(minCommits) || 1;
    config.commitDensity.max = parseInt(maxCommits) || 5;
  } else {
    config.commitDensity.type = "fixed";
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const fixedCommits = await askQuestion("Commits per day (1-10): ");
    config.commitDensity.fixed = parseInt(fixedCommits) || 2;
  }

  // Save configuration
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 Saving configuration...");

  fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));

  console.log("\n✅ Configuration saved successfully!");

  // Question 5: GitHub Repository Setup
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("5️⃣  GitHub Repository Setup");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   📌 You need a GitHub repository to push commits to.");
  console.log("   💡 Create one at: https://github.com/new\n");

  const repoUrl = await askQuestion("Enter your repository URL (e.g., https://github.com/username/repo.git): ");

  if (repoUrl && repoUrl.trim() !== "") {
    console.log("\n🔧 Setting up Git repository...");

    // Detect if using HTTPS or SSH
    const isHttps = repoUrl.startsWith("https://");
    const isSsh = repoUrl.startsWith("git@");

    try {
      // Initialize git if not already initialized
      try {
        execSync("git rev-parse --git-dir", { stdio: "ignore" });
        console.log("✓ Git already initialized");
      } catch {
        execSync("git init", { stdio: "inherit" });
        console.log("✓ Git initialized");
      }

      // Set up git user if not already set
      const gitEmail = await askQuestion("\nEnter your GitHub email: ");
      const gitName = await askQuestion("Enter your name: ");

      if (gitEmail && gitEmail.trim() !== "") {
        execSync(`git config user.email "${gitEmail}"`, { stdio: "inherit" });
        console.log("✓ Git email configured");
      }

      if (gitName && gitName.trim() !== "") {
        execSync(`git config user.name "${gitName}"`, { stdio: "inherit" });
        console.log("✓ Git name configured");
      }

      // Check if remote already exists
      try {
        execSync("git remote get-url origin", { stdio: "ignore" });
        // Remote exists, update it
        execSync(`git remote set-url origin ${repoUrl}`, { stdio: "inherit" });
        console.log("✓ Remote 'origin' updated");
      } catch {
        // Remote doesn't exist, add it
        execSync(`git remote add origin ${repoUrl}`, { stdio: "inherit" });
        console.log("✓ Remote 'origin' added");
      }

      console.log("\n✅ Git repository configured successfully!");

      // Authentication guidance
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔐 Authentication Setup");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      if (isHttps) {
        console.log("\n⚠️ You're using HTTPS. GitHub requires authentication!");
        console.log("\nChoose ONE of these methods:\n");
        console.log("1️⃣ GitHub CLI (Easiest - Recommended):");
        console.log("   • Install: https://cli.github.com/");
        console.log("   • Run: gh auth login");
        console.log("   • Follow the prompts\n");
        
        console.log("2️⃣ Personal Access Token (PAT):");
        console.log("   • Go to: https://github.com/settings/tokens");
        console.log("   • Click 'Generate new token (classic)'");
        console.log("   • Select scopes: 'repo' (full control)");
        console.log("   • Copy the token");
        console.log("   • When git asks for password, paste the token\n");
        
        console.log("3️⃣ Git Credential Manager:");
        console.log("   • Usually pre-installed with Git for Windows");
        console.log("   • Will prompt for GitHub login automatically\n");

        const authChoice = await askQuestion("Have you set up authentication? (Y/n): ");
        
        if (authChoice.toLowerCase() === "n") {
          console.log("\n💡 Please set up authentication first, then run:");
          console.log("   node index.js");
          console.log("\n❌ Skipping auto-run to avoid authentication errors.");
          rl.close();
          return;
        }
        
      } else if (isSsh) {
        console.log("\n⚠️ You're using SSH. You need SSH keys set up!");
        console.log("\nSetup SSH keys:\n");
        console.log("1️⃣ Generate SSH key:");
        console.log(`   ssh-keygen -t ed25519 -C "${gitEmail}"`);
        console.log("   (Press Enter to accept defaults)\n");
        
        console.log("2️⃣ Copy your public key:");
        console.log("   • Windows: type %USERPROFILE%\\.ssh\\id_ed25519.pub");
        console.log("   • Mac/Linux: cat ~/.ssh/id_ed25519.pub\n");
        
        console.log("3️⃣ Add to GitHub:");
        console.log("   • Go to: https://github.com/settings/ssh/new");
        console.log("   • Paste your public key");
        console.log("   • Click 'Add SSH key'\n");

        const sshChoice = await askQuestion("Have you set up SSH keys? (Y/n): ");
        
        if (sshChoice.toLowerCase() === "n") {
          console.log("\n💡 Please set up SSH keys first, then run:");
          console.log("   node index.js");
          console.log("\n❌ Skipping auto-run to avoid authentication errors.");
          rl.close();
          return;
        }
      }

      // Test connection
      console.log("\n🧪 Testing connection to GitHub...");
      try {
        if (isHttps) {
          execSync("git ls-remote origin", { stdio: "ignore", timeout: 10000 });
          console.log("✅ Connection successful! You're authenticated.");
        } else if (isSsh) {
          execSync("ssh -T git@github.com", { stdio: "ignore", timeout: 10000 });
          console.log("✅ SSH connection successful!");
        }
      } catch (error) {
        console.log("⚠️ Could not verify connection. This might cause issues.");
        console.log("If you see authentication errors later, please set up:");
        if (isHttps) {
          console.log("  • GitHub CLI (gh auth login)");
          console.log("  • Or Personal Access Token");
        } else if (isSsh) {
          console.log("  • SSH keys properly");
        }
        
        const continueAnyway = await askQuestion("\nContinue anyway? (y/N): ");
        if (continueAnyway.toLowerCase() !== "y") {
          console.log("\n💡 Fix authentication, then run: node index.js");
          rl.close();
          return;
        }
      }

    } catch (error) {
      console.log("\n⚠️ Warning: Some git commands failed. You may need to set up manually.");
      console.log("Run these commands:");
      console.log(`  git config user.email "${gitEmail || 'your-email@example.com'}"`);
      console.log(`  git config user.name "${gitName || 'Your Name'}"`);
      console.log(`  git remote set-url origin ${repoUrl}`);
    }
  } else {
    console.log("\n⚠️ No repository URL provided. You'll need to set it up manually:");
    console.log("  git remote add origin https://github.com/username/repo.git");
  }

  console.log("\n╔═══════════════════════════════════════╗");
  console.log("║         Configuration Summary         ║");
  console.log("╠═══════════════════════════════════════╣");
  console.log(`║ Mode: ${config.mode.padEnd(30)} ║`);
  console.log(`║ Year: ${config.year.toString().padEnd(30)} ║`);
  console.log(`║ Total Commits: ${config.totalCommits.toString().padEnd(21)} ║`);
  console.log(
    `║ Density: ${config.commitDensity.type.padEnd(27)} ║`
  );
  console.log("╚═══════════════════════════════════════╝\n");

  rl.close();

  // Ask if user wants to start immediately
  const startNow = await new Promise((resolve) => {
    const confirmRl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    
    confirmRl.question("🚀 Start creating commits now? (Y/n): ", (answer) => {
      confirmRl.close();
      resolve(answer.toLowerCase() !== "n");
    });
  });

  if (startNow) {
    console.log("\n⏳ Starting commit generation...\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    // Run index.js
    const nodeProcess = spawn("node", ["index.js"], {
      stdio: "inherit",
      shell: true,
    });

    nodeProcess.on("close", (code) => {
      if (code === 0) {
        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ All done! Check your GitHub profile!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      } else {
        console.log("\n❌ Something went wrong. Please check the errors above.");
      }
    });
  } else {
    console.log("\n💡 When you're ready, run:");
    console.log("   node index.js\n");
  }
}

setup();
