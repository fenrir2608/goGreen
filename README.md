# 🌱 goGreen 

With **goGreen**, you can make your profile look like you've been hard at work... even if you haven't. 
NodeJs script to make commits to the past (or the future) to go green on GitHub.

## About

**goGreen** helps you create commits on your GitHub profile for any date in the past. Whether you want to fill up your contribution graph or even make cool patterns and artwork.

## Getting Started

Node.js 18+ and Git are required. No npm dependencies are needed.

Preview 100 unique random dates from the previous 365 completed days:

```bash
node index.js
```

Create and push the commits only after reviewing the preview:

```bash
node index.js --count 100 --days 365 --push
```

The working tree must be clean before `--push` is accepted. Each generated commit
changes only `data.json`, and all commits are pushed after the full batch succeeds.

## Room for Improvement

So, you've got the basics down. What's next?

- **Custom Patterns:** Experiment with different patterns on your contribution graph. Maybe spell out your name or create some cool designs.
- **Density Control:** Play around with the number of commits per day to adjust the shades of green.
- **Input Strings:** Convert input strings to X-Y mapped contributions.

## Tests

```bash
npm test
```

## Credits

Huge thanks to [Akshay Saini](https://github.com/akshaymarch7) for the original video behind this project.
