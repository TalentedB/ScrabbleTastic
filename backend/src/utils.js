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

export function printData(data) {
  for (let row of board) {
    console.log(row);
  }
}
