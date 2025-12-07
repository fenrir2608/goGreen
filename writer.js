import { markCommit } from "./index.js";
import { font } from "./font.js";
import simpleGit from "simple-git";

const writeText = (text, startX = 0) => {
  const chars = text.toLowerCase().split("");
  let currentX = startX;
  const queue = [];

  chars.forEach((char) => {
    if (font[char]) {
      const bitmap = font[char];
      // bitmap is row-major (y comes first), but we want to iterate cols (x) then rows (y)
      // Actually simpler to store linear list of coords
      for (let y = 0; y < bitmap.length; y++) {
        for (let x = 0; x < bitmap[y].length; x++) {
          if (bitmap[y][x]) {
            queue.push({ x: currentX + x, y: y + 1 }); // +1 to avoid Sunday (0) or strict alignment
          }
        }
      }
      currentX += bitmap[0].length + 1; // +1 for spacing
    } else {
      currentX += 3; // Space width
    }
  });

  const processQueue = () => {
    if (queue.length === 0) {
        console.log("Pushing changes...");
        return simpleGit().push();
    }
    const { x, y } = queue.shift();
    markCommit(x, y, processQueue);
  };

  processQueue();
};

// Example usage: node writer.js hello
const text = process.argv[2] || "hello";
writeText(text);
