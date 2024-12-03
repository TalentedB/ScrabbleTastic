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
    `Clients connected: Client 0 ${clients[0] === null ? "Disconnected" : "Connected"}, Client 1 ${clients[1] === null ? "Disconnected" : "Connected"}`,
  );
}
