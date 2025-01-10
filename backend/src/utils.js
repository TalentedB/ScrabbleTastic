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

export function setPlayableOnGridFalse(board) {
  for (let row of board) {
    for (let cell of row) {
      if (cell["char"] !== "") {
        cell["playable"] = false;
      }
    }
  }
}

export const isEveryValueTrue = (obj) =>
  Object.values(obj).every((value) => value === true);

export function printGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    let row = "";
    for (let j = 0; j < grid[i].length; j++) {
      row += grid[i][j] + " ";
    }
    console.log(row.trim());
  }
}

export function printConnectionStatus(clients) {
  console.log(
    `Clients connected: Client 0 ${clients[0].conn === null ? "Disconnected" : "Connected"}, Client 1 ${clients[1].conn === null ? "Disconnected" : "Connected"}`,
  );
}

export function calcPoints(words) {
  let totalPoints = 0;

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words[i].length; j++) {
      totalPoints += pointDistribution[words[i][j]];
    }
  }

  return totalPoints;
}
