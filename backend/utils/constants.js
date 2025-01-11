import fs from "fs";

let pointDistribution = {};

fs.readFile("assets/pointDistribution.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse the JSON data
  pointDistribution = JSON.parse(data);
});

export const POINTSDISTRIBUTION = pointDistribution;

// Create the letter Distribution
const LETTERDISTRIBUTIONS = {
  E: 12,
  A: 9,
  I: 9,
  O: 8,
  N: 6,
  R: 6,
  T: 6,
  L: 4,
  S: 4,
  U: 4,
  D: 4,
  G: 3,
  B: 2,
  C: 2,
  M: 2,
  P: 2,
  F: 2,
  H: 2,
  V: 2,
  W: 2,
  Y: 2,
  K: 1,
  J: 1,
  X: 1,
  Q: 1,
  Z: 1,
};

let letters = "";

for (const key in LETTERDISTRIBUTIONS) {
  letters += key.repeat(LETTERDISTRIBUTIONS[key]);
}

export const LETTERS = letters;
