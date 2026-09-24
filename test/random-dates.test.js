import assert from "node:assert/strict";
import test from "node:test";

import { generateRandomDates } from "../random-dates.js";

test("generates the requested number of unique dates inside the completed-day window", () => {
  const now = new Date("2026-09-24T12:00:00.000Z");
  const dates = generateRandomDates({
    count: 100,
    days: 365,
    now,
    random: () => 0.5,
  });

  assert.equal(dates.length, 100);
  assert.equal(new Set(dates.map((date) => date.toISOString())).size, 100);

  const earliest = new Date("2025-09-24T12:00:00.000Z");
  const latest = new Date("2026-09-23T12:00:00.000Z");
  for (const date of dates) {
    assert.ok(date >= earliest);
    assert.ok(date <= latest);
  }
});

test("rejects an impossible request for more unique dates than the window contains", () => {
  assert.throws(
    () => generateRandomDates({ count: 366, days: 365 }),
    /cannot exceed days/i,
  );
});

test("rejects non-positive counts and windows", () => {
  assert.throws(() => generateRandomDates({ count: 0 }), /positive integer/i);
  assert.throws(() => generateRandomDates({ count: 1, days: 0 }), /positive integer/i);
});
