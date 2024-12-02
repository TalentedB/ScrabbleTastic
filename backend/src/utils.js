export function setPlayableOnGridFalse(board) {
  for (let row of board) {
    for (let cell of row) {
      if (cell["char"] !== "") {
        cell["playable"] = false;
      }
    }
  }
}

export function printData(data) {
  for (let row of board) {
    console.log(row);
  }
}
