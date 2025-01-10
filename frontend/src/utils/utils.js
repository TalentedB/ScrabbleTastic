// Letters Utils
import { LETTERS, TURNS } from "./constants.js";

let cellDOMRefs = null;

// Need this
export function setCellDOMRefs(refs) {
  cellDOMRefs = refs;
}

export function generateRandomLetters(samples = 1) {
  const randomLetters = [];
  for (let i = 0; i < samples; i++) {
    randomLetters.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  }
  return randomLetters;
}

export function keepEnabled(row, column) {
  for (let i = 0; i < cellDOMRefs.current.length; i++) {
    for (let j = 0; j < cellDOMRefs.current[i].length; j++) {
      if (
        i === row ||
        j === column ||
        (Object.is(row, null) &&
          Object.is(column, null) &&
          !cellDOMRefs.current[i][j].current.classList.contains(
            "already-played",
          ))
      ) {
        cellDOMRefs.current[i][j].current.disabled = false;
      } else {
        cellDOMRefs.current[i][j].current.disabled = true;
      }
    }
  }
}

export function disableBoard() {
  for (let i = 0; i < cellDOMRefs.current.length; i++) {
    for (let j = 0; j < cellDOMRefs.current[i].length; j++) {
      cellDOMRefs.current[i][j].current.disabled = true;
    }
  }
}

export function getIndexByCell(cell) {
  const row = parseInt(cell.getAttribute("data-row"));
  const column = parseInt(cell.getAttribute("data-column"));
  return { row, column };
}

// testing
export function highlightRow(i) {
  const gridRow = cellDOMRefs.current[i];
  for (const el of gridRow) {
    highlightCell(el.current, true);
  }
}

export function getColumn(matrix, columnIndex) {
  return matrix.map((row) => row[columnIndex]);
}

function highlightCell(cell, on) {
  if (on && !cell.classList.contains("already-played")) {
    cell.classList.add("highlight");
    cell.classList.remove("border-black");
  } else {
    cell.classList.remove("highlight");
    cell.classList.add("border-black");
  }
}

function highlightCells(cells, on) {
  for (let cell of cells) {
    highlightCell(cell, on);
  }
}

// TODO - Get better name for this function
function enableOnlyCells(cells, enable) {
  for (let i = 0; i < cellDOMRefs.current.length; i++) {
    for (let j = 0; j < cellDOMRefs.current[i].length; j++) {
      if (cells.has(cellDOMRefs.current[i][j].current)) {
        cellDOMRefs.current[i][j].current.disabled = !enable;
      } else {
        cellDOMRefs.current[i][j].current.disabled = enable;
      }
    }
  }
}

export function highlightCol(j) {
  const gridCol = getColumn(cellDOMRefs.current, j);
  for (const el of gridCol) {
    highlightCell(el.current, true);
  }
}

export function clearHighlight() {
  for (const row of cellDOMRefs.current) {
    for (const el of row) {
      highlightCell(el.current, false);
    }
  }
}

export function standardizeGrid(grid) {
  const standardizedGrid = [];
  for (let row of grid) {
    const standardizedRow = [];
    for (let cell of row) {
      standardizedRow.push(cell.current.value);
    }
    standardizedGrid.push(standardizedRow);
  }
  return standardizedGrid;
}

export function updateDisplayGrid(board) {
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      cellDOMRefs.current[i][j].current.value = board[i][j];
    }
  }
}

export function handleSubmission(cellsPlayedState, wsRef, setPlayersTurn) {
  if (cellsPlayedState.length === 0) {
    console.log("Invalid"); // TODO: Add red everywhere for invalid entry
  } else if (cellsPlayedState.length === 1) {
    setPlayersTurn(TURNS.OPPONENT);
    sendWords([cellsPlayedState[0].value], wsRef);
  } else {
    setPlayersTurn(TURNS.OPPONENT);
    // We need to sort by row or column

    const wordsPlayed = [];

    // Check to see if we are sorted by row or column
    const playedRow =
      cellsPlayedState[0].getAttribute("data-row") ===
      cellsPlayedState[1].getAttribute("data-row");

    if (playedRow) {
      cellsPlayedState.sort((cell1, cell2) => {
        const { column: col1 } = getIndexByCell(cell1);
        const { column: col2 } = getIndexByCell(cell2);
        return col1 - col2;
      });

      // Push any words that were created on the side
      for (let cell of cellsPlayedState) {
        let { row, column: col } = getIndexByCell(cell);

        console.log(cellDOMRefs);
        console.log(cellDOMRefs.current);
        console.log(cellDOMRefs.current[row + 1]);
        console.log(cellDOMRefs.current[row + 1][col]);
        console.log(cellDOMRefs.current[row + 1][col].current);
        console.log(cellDOMRefs.current[row + 1][col].current.value);

        if (
          (row + 1 < cellDOMRefs.current.length &&
            cellDOMRefs.current[row + 1][col].current.value !== "") ||
          (0 <= row - 1 &&
            cellDOMRefs.current[row - 1][col].current.value !== "")
        ) {
          let i = 0;
          while (
            0 <= cellDOMRefs.current.length &&
            cellDOMRefs.current[row + i][col] !== ""
          ) {
            i--;
          }
          i++;

          let word = "";

          while (
            row + i < cellDOMRefs.current.length &&
            cellDOMRefs.current[row + i][col] !== ""
          ) {
            word += cellDOMRefs.current[row + i][col].current.value;
            i++;
          }
          wordsPlayed.push(word);
        }
      }

      // Push the actually word played
      let { row, column: col } = getIndexByCell(cellsPlayedState[0]);

      let i = 0;
      while (0 <= col + i && cellDOMRefs.current[row][col + i] !== "") {
        i--;
      }
      i++;

      let word = "";
      while (
        col + i < cellDOMRefs.current[0].length &&
        cellDOMRefs.current[row][col + i] !== ""
      ) {
        word += cellDOMRefs.current[row][col + i].current.value;
        i++;
      }
      wordsPlayed.push(word);
    } else {
      cellsPlayedState.sort((cell1, cell2) => {
        const { row: row1 } = getIndexByCell(cell1);
        const { row: row2 } = getIndexByCell(cell2);
        return row1 - row2;
      });

      // Push any words that were created on the side

      for (let cell of cellsPlayedState) {
        let { row, column: col } = getIndexByCell(cell);

        if (
          (col + 1 < cellDOMRefs.current[0].length &&
            cellDOMRefs.current[row][col + 1].current.value !== "") ||
          (0 <= col - 1 &&
            cellDOMRefs.current[row][col - 1].current.value !== "")
        ) {
          let i = 0;
          while (0 <= col + i && cellDOMRefs.current[row][col + i] !== "") {
            i--;
          }
          i++;

          let word = "";

          while (
            col + i < cellDOMRefs.current[0].length &&
            cellDOMRefs.current[row][col + i] !== ""
          ) {
            word += cellDOMRefs.current[row][col + i].current.value;
            i++;
          }
          wordsPlayed.push(word);
        }
      }

      // Push the actually word played
      let { row, column: col } = getIndexByCell(cellsPlayedState[0]);

      let i = 0;
      while (0 <= row + i && cellDOMRefs.current[row + i][col] !== "") {
        i--;
      }
      i++;

      let word = "";
      while (
        row + i < cellDOMRefs.current.length &&
        cellDOMRefs.current[row + i][col] !== ""
      ) {
        word += cellDOMRefs.current[row + i][col].current.value;
        i++;
      }
      wordsPlayed.push(word);
    }
    console.log(wordsPlayed);
    sendWords(wordsPlayed, wsRef);
  }
}

async function sendWords(words, wsRef) {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({
        board: standardizeGrid(cellDOMRefs.current),
        words: words,
      }),
    );
  } else {
    console.error("WebSocket is not open");
  }
}

export function highlightAndEnableOnlyAdjacentCellsToWordsPlayed() {
  let border = getClusterBorderByCell();
  if (border.size !== 0) {
    highlightCells(border, true);
    enableOnlyCells(border, true, cellDOMRefs.current);
  }
}

export function getClusterBorderByCell() {
  const cellsPlayed = getCellsPlayed();
  const border = new Set();

  for (let curCel of cellsPlayed) {
    let surrNonPlayedCells = getSurrNonPlayedCells(curCel, false);
    for (let surCel of surrNonPlayedCells) {
      border.add(surCel);
      // for (let surCel of surroundingCells["rows"]) {
      //   if (surCel.value === "") {
      //     border.add(surCel);
      //   }
      // }
      // for (let surCel of surroundingCells["cols"]) {
      //   if (surCel.value === "") {
      //     border.add(surCel);
      //   }
      // }
    }
  }

  return border;
}

function getCellsPlayed() {
  const cellsPlayed = new Set();
  for (let i = 0; i < cellDOMRefs.current.length; i++) {
    for (let j = 0; j < cellDOMRefs.current[i].length; j++) {
      if (cellDOMRefs.current[i][j].current.value !== "") {
        cellsPlayed.add(cellDOMRefs.current[i][j].current);
      }
    }
  }
  return cellsPlayed;
}

export function handlePlayed(row, col) {
  const gridSize = cellDOMRefs.current.length;
  let firstTurn = true;
  if (
    (row < gridSize &&
      cellDOMRefs.current[row + 1][col].current.value !== "") ||
    (row > 0 && cellDOMRefs.current[row - 1][col].current.value !== "")
  ) {
    highlightCol(col);
    keepEnabled(null, col);
    firstTurn = false;
  }
  if (
    (col < gridSize &&
      cellDOMRefs.current[row][col + 1].current.value !== "") ||
    (col > 0 && cellDOMRefs.current[row][col - 1].current.value !== "")
  ) {
    highlightRow(row);
    keepEnabled(row, null);
    firstTurn = false;
  }

  if (firstTurn) {
    highlightRow(row);
    highlightCol(col);
    keepEnabled(row, col);
  }
}

function getSurrNonPlayedCells(cell) {
  const { row, column } = getIndexByCell(cell);
  const gridSize = cellDOMRefs.current.length;

  const surrNonPlayedCells = new Set();

  if (
    row + 1 < gridSize &&
    cellDOMRefs.current[row + 1][column].current.value === ""
  ) {
    surrNonPlayedCells.add(cellDOMRefs.current[row + 1][column].current);
  }
  if (
    row - 1 > 0 &&
    cellDOMRefs.current[row - 1][column].current.value === ""
  ) {
    surrNonPlayedCells.add(cellDOMRefs.current[row - 1][column].current);
  }
  if (
    column + 1 < gridSize &&
    cellDOMRefs.current[row][column + 1].current.value === ""
  ) {
    surrNonPlayedCells.add(cellDOMRefs.current[row][column + 1].current);
  }
  if (
    column - 1 > 0 &&
    cellDOMRefs.current[row][column - 1].current.value === ""
  ) {
    surrNonPlayedCells.add(cellDOMRefs.current[row][column - 1].current);
  }

  return surrNonPlayedCells;
}

export function disableCharactersPlayed(boardState) {
  for (let i = 0; i < boardState.length; i++) {
    for (let j = 0; j < boardState.length; j++) {
      if (boardState[i][j] !== "") {
        cellDOMRefs.current[i][j].current.classList.add("already-played");
        cellDOMRefs.current[i][j].current.disabled = true;
      }
    }
  }
}

// Todo, fix for the very first move
export function determineMoveValidity(playedCell) {
  const { row, col } = getIndexByCell(playedCell);
  let closestCellDistance = Infinity;

  for (let i = 0; i < cellDOMRefs.current.length; i++) {
    let currentCellDistance = Math.abs(row - i);
    if (
      cellDOMRefs.current[i][col].current.value !== "" &&
      currentCellDistance < closestCellDistance
    ) {
      closestCellDistance = currentCellDistance;
    }
  }

  for (let j = 0; j < cellDOMRefs.current.length; j++) {
    let currentCellDistance = Math.abs(col - j);
    if (
      cellDOMRefs.current[row][j].current.value !== "" &&
      currentCellDistance < closestCellDistance
    ) {
      closestCellDistance = currentCellDistance;
    }
  }

  return closestCellDistance < 5;
}

function getConnectedCellsByAxis(cell, axis, grid) {
  let connectedCells = [];
  let { row, column } = getIndexByCell(cell);

  if (axis === "row") {
    for (let i = 0; i < grid.length; i++) {
      if (grid[row][i] === "") {
        break;
      }
      connectedCells.push(cellDOMRefs.current[row][i].current);
    }
  } else {
    for (let i = 0; i < grid.length; i++) {
      if (grid[i][column] !== "") {
        break;
      }
      connectedCells.push(cellDOMRefs.current[i][column].current);
    }
  }

  connectedCells.sort((a, b) => {
    const { row: rowA, column: colA } = getIndexByCell(a);
    const { row: rowB, column: colB } = getIndexByCell(b);

    if (axis === "row") {
      return colA - colB;
    } else {
      return rowA - rowB;
    }
  });

  return connectedCells.sort;
}

export function getWordCellsFromPlayed(playedCells, grid) {
  if (playedCells.length > 1) {
    let word = "";
    let wordCells = [];
    let axis = "row";
    if (
      getIndexByCell(playedCells[0]).row === getIndexByCell(playedCells[1]).row
    ) {
      axis = "col";
    }

    wordCells = getConnectedCellsByAxis(playedCells[0], "col", grid);
    wordCells.forEach((cell) => {
      word += cell.value;
    });
    return word;
  }
}
