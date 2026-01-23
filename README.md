# 🌱 goGreen

**Automate GitHub contribution history with customizable commit patterns**

A powerful Node.js tool that generates backdated commits to create custom patterns on your GitHub contribution graph. Whether you want to fill up your contribution graph, create artistic patterns, or build impressive streaks - goGreen makes it easy!

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/Yuvraj-777/commit/issues)

---

## ✨ Features

- 🎨 **Multiple Pattern Modes** - Random, consecutive, or custom designs
- 📅 **Date Range Control** - Target any year (2000-2030)
- 🎯 **Commit Density** - Control light to dark green shades
- 💾 **Auto-Resume** - Recover from interruptions automatically
- 🔄 **Batch Pushing** - Safe, incremental pushes every 50 commits
- 🎭 **8 Pre-built Patterns** - Stripes, checkerboard, heart, and more
- 🛡️ **Error Handling** - Progress saved on failures
- 👥 **Beginner-Friendly** - Interactive setup wizard

---

## 🚀 Quick Start

### ⚠️ BEFORE YOU BEGIN

1. **Read this README completely** - Takes 5 minutes, saves hours
2. **Create a PRIVATE repository** - Follow steps in Prerequisites above
3. **Copy your repository URL** - You'll need it during setup (looks like: `https://github.com/YourUsername/repo.git`)
4. **Enable "Private contributions"** - See Prerequisites section
5. **Know your GitHub email** - Check at [github.com/settings/emails](https://github.com/settings/emails)

### For Beginners (3 Simple Steps)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the setup wizard**
   ```bash
   node setup.js
   ```
   Answer the simple questions (mode, year, commits, etc.)

3. **That's it!** The script will automatically create and push commits

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/) installed
- A GitHub account
- An empty GitHub repository

### 🔒 Create Your Repository (Step-by-Step)

**Follow these exact steps:**

1. **Go to** [github.com/new](https://github.com/new)

2. **Repository name**: Type anything (e.g., "commit" or "contributions")

3. **Visibility**: Select **"Private"** ✅
   - This keeps your commits safe while testing
   - You can always make it public later if needed

4. **Don't check any boxes** - Keep everything unchecked:
   - ❌ Don't add README
   - ❌ Don't add .gitignore
   - ❌ Don't choose a license
   - Repository must be completely empty!

5. **Click "Create repository"**

6. **Copy your repository URL**:
   - You'll see a page with setup instructions
   - Look for a box at the top with a URL like:
     ```
     https://github.com/YourUsername/YourRepo.git
     ```
   - Click the **copy button** (📋) next to it
   - Save this URL - you'll need it during setup!

### 📊 Making Your Commits Visible

Since your repository is private, commits won't show on your profile by default.

**Enable private contributions (takes 30 seconds):**

1. Go to [github.com/settings/profile](https://github.com/settings/profile)
2. Scroll to **"Contributions & Activity"**
3. Check the box: ✅ **"Private contributions"**
4. Click **"Update preferences"**

Done! Your contribution graph will now show activity from private repos.

---

## ⚠️ Read Before Starting

**IMPORTANT:** Please read this README completely before customization!

### How goGreen Works

1. **Configuration Phase** (`setup.js`)
   - Creates `config.json` with your preferences
   - Sets up git repository connection
   - Configures authentication

2. **Generation Phase** (`index.js`)
   - Reads your configuration
   - Creates commits with custom dates using `git commit --date`
   - Each commit modifies `data.json` file
   - Pushes in batches of 50 to avoid timeouts

3. **GitHub Processing**
   - GitHub receives backdated commits
   - Contribution graph updates based on commit dates
   - Email matching is verified (must match GitHub account)
   - Private repos need "show private contributions" enabled

### Understanding the Process

```
Your Config → Script Generates Commits → Git Pushes → GitHub Updates Graph
   ↓              ↓                         ↓              ↓
Mode, Year,    Creates files with       Batched every   Green squares
Commits,       backdated timestamps      50 commits     appear on profile
Density
```

**Key Points:**
- Commits are real git commits with custom dates
- They appear in your repository history
- Your contribution graph reflects these dates
- Email must match your GitHub account email
- Private repos require "show private contributions" setting

---

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/Yuvraj-777/commit.git
cd goGreen

# Install dependencies
npm install

# Run the interactive setup
node setup.js
```

---

## 📖 Usage

### Interactive Setup (Recommended)

```bash
node setup.js
```

The wizard will guide you through:
1. **Mode Selection** - Random, Consecutive, or Pattern
2. **Year** - Which year to fill (e.g., 2024)
3. **Commit Count** - How many commits to create
4. **Density** - Random (1-5) or Fixed amount
5. **Repository URL** - Paste the URL you copied (e.g., `https://github.com/YourUsername/repo.git`)
6. **GitHub Email** - Must match your GitHub account email exactly
7. **Your Name** - For git configuration

Press **Y** when asked to start, and commits will be created automatically!

### Manual Configuration (Advanced)

Edit `config.json` directly:

```json
{
  "mode": "random",
  "year": 2024,
  "totalCommits": 400,
  "commitDensity": {
    "type": "random",
    "min": 1,
    "max": 5
  }
}
```

Then run:
```bash
node index.js
```

---

## 🎨 Available Patterns

| Pattern | Description | Visual |
|---------|-------------|--------|
| **Random** | Naturally scattered commits | 🟩⬜🟩⬜🟩 |
| **Consecutive** | Build long streaks | ▓▓▓▓▓▓▓▓ |
| **Vertical Stripes** | Column pattern | 🟩⬜⬜🟩⬜ |
| **Horizontal Stripes** | Row pattern | 🟩🟩🟩🟩🟩 |
| **Checkerboard** | Alternating squares | 🟩⬜🟩⬜🟩 |
| **Diagonal Lines** | Diagonal pattern | ⬜🟩⬜🟩⬜ |
| **Border Frame** | Edge outline | 🔲🔲🔲🔲 |
| **Heart** | ❤️ Love shape | ⬜🟩🟩🟩⬜ |

---

## 💡 Examples

### Fill an entire year naturally
```json
{
  "mode": "random",
  "year": 2023,
  "totalCommits": 600,
  "commitDensity": { "type": "random", "min": 2, "max": 8 }
}
```

### Build a 90-day streak
```json
{
  "mode": "consecutive",
  "year": 2024,
  "totalCommits": 90,
  "commitDensity": { "type": "fixed", "fixed": 2 }
}
```

### Create a heart pattern
Choose Pattern mode → Option 6 (Heart) in setup wizard

---

## 🔄 Resume & Reset

If the script is interrupted, simply run it again:

```bash
node index.js
```

You'll see options to:
- **[1] Resume** - Continue from where you stopped
- **[2] Reset** - Start over (optionally remove local commits)
- **[3] Cancel** - Exit without changes

---

## 🔐 Authentication

### HTTPS (Recommended)
Use **GitHub CLI** for easiest setup:
```bash
gh auth login
```

Or use a **Personal Access Token**:
1. Go to https://github.com/settings/tokens
2. Generate token with `repo` scope
3. Use token as password when pushing

### SSH
Set up SSH keys:
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```
Add public key to: https://github.com/settings/ssh/new

---

## ⚠️ Important Notes

### Email Matching (Critical!)

Your git email **MUST** match your GitHub account email:

```bash
# Check your current git email
git config user.email

# It should match your GitHub email exactly
```

**To verify your GitHub email:**
1. Go to [github.com/settings/emails](https://github.com/settings/emails)
2. Copy your primary or verified email
3. Use this exact email in setup

### Repository Visibility

### Repository Visibility

Your commits are in a **private repository**, which means:
- ✅ Safe and hidden from public view
- ✅ Must enable "Private contributions" setting (see Prerequisites above)
- ✅ Can make public later if desired (Settings → Danger Zone → Change visibility)

### Commit Visibility Timeline

If commits don't appear on your profile:
- ✅ Check "Private contributions" is enabled ([github.com/settings/profile](https://github.com/settings/profile))
- Wait 5-10 minutes for GitHub to process
- Verify email matches your GitHub account
- Refresh your profile page (Ctrl+F5)

---

## 🛠️ Troubleshooting

**Commits not showing on GitHub?**
- Check git email matches GitHub account: `git config user.email`
- Verify repository exists and you have push access
- Check authentication is set up correctly

**Script crashes?**
- Don't worry! Progress is saved automatically
- Just run `node index.js` again to resume

**Authentication errors?**
- Set up GitHub CLI: `gh auth login`
- Or use Personal Access Token instead of password

---

## 📁 Project Structure

```
goGreen/
├── setup.js              # Interactive configuration wizard
├── index.js              # Main commit generator
├── package.json     # Interactive wizard
├── index.js         # Main generator
├── package.json     # Dependencies
├── README.md        # This file
├── LICENSE          # License
└── .gitignore       # Ignored files
```

---

## 🙏 Credits

**Original Concept:** [Akshay Saini](https://github.com/akshaymarch7)  
**Base Repository:** [fenrir2608/goGreen](https://github.com/fenrir2608/goGreen)

### Enhancements & Contributions

This fork includes significant improvements:
- 🎨 Interactive setup wizard with step-by-step guidance
- ⚙️ Configuration system with JSON-based settings
- 🎭 8 pre-built patterns (stripes, checkerboard, heart, etc.)
- 💾 Auto-resume functionality with progress tracking
- 🔄 Batch pushing (every 50 commits) for reliability
- 🛡️ Comprehensive error handling and recovery
- 🔐 Authentication setup guidance (HTTPS & SSH)
- 📖 Detailed documentation and troubleshooting
- 🔒 Private repository workflow recommendations

**Maintained by:** [Yuvraj-777](https://github.com/Yuvraj-777)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Areas for contribution:**
- Additional pattern designs
- UI improvements for setup wizard
- Performance optimizations
- Documentation enhancements
- Bug fixes

---

## 📦 npm Modules Used

- [`moment`](https://www.npmjs.com/package/moment) - Date and time manipulation
- [`simple-git`](https://www.npmjs.com/package/simple-git) - Git command wrapper
- [`random`](https://www.npmjs.com/package/random) - Random number generation
- [`jsonfile`](https://www.npmjs.com/package/jsonfile) - JSON file operations

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

**Made with ❤️ by the goGreen team**

*Use responsibly for legitimate purposes like portfolio visualization and historical data migration.*