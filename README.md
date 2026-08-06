# 🌱 goGreen

goGreen is an interactive Node.js command-line tool for creating dated Git commits in a repository. It is intended for testing contribution-graph patterns and Git date behavior—not for misrepresenting work.

## Requirements

- Node.js 18 or newer
- Git installed and configured
- A repository with an `origin` remote
- GitHub authentication already configured for pushing

## Run

```bash
git clone https://github.com/fenrir2608/goGreen.git
cd goGreen
npm install
npm start
```

The interface asks for:

- number of commits, from 1 to 365;
- start and end dates in `YYYY-MM-DD` format;
- confirmation before creating commits;
- separate confirmation before pushing to `origin`.

Dates are selected uniquely, future dates are rejected, and errors stop the process instead of being ignored. The default is 10 commits over the previous year.

## Important

The tool changes Git history and can push to the configured remote. Verify `git remote -v` before confirming. Review the generated commits locally if you choose not to push immediately.

## Development

```bash
npm test
```

## Credits

Inspired by the original project and video by [Akshay Saini](https://github.com/akshaymarch7).
