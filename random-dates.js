import { randomInt } from "node:crypto";

const DAY_MS = 24 * 60 * 60 * 1000;

export function generateRandomDates({
  count,
  days = 365,
  now = new Date(),
  random = () => randomInt(0, 2 ** 32) / 2 ** 32,
}) {
  if (!Number.isInteger(count) || count <= 0) {
    throw new TypeError("count must be a positive integer");
  }
  if (!Number.isInteger(days) || days <= 0) {
    throw new TypeError("days must be a positive integer");
  }
  if (count > days) {
    throw new RangeError("count cannot exceed days when dates must be unique");
  }

  const offsets = Array.from({ length: days }, (_, index) => index + 1);
  for (let index = offsets.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [offsets[index], offsets[swapIndex]] = [offsets[swapIndex], offsets[index]];
  }

  return offsets
    .slice(0, count)
    .map((offset) => new Date(now.getTime() - offset * DAY_MS))
    .sort((left, right) => left - right);
}
