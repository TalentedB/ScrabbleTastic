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
    sendWord([cellsPlayedState[0].value], wsRef);
  } else {
    setPlayersTurn(TURNS.OPPONENT);
    // We need to sort by row or column
    let sortedWord = "";

    // Check to see if we are sorted by row or column
    if (
      cellsPlayedState[0].getAttribute("data-row") ===
      cellsPlayedState[1].getAttribute("data-row")
    ) {
      cellsPlayedState.sort((cell1, cell2) => {
        const { column: col1 } = getIndexByCell(cell1);
        const { column: col2 } = getIndexByCell(cell2);
        return col1 - col2;
      });
    } else {
      cellsPlayedState.sort((cell1, cell2) => {
        const { row: row1 } = getIndexByCell(cell1);
        const { row: row2 } = getIndexByCell(cell2);
        return row1 - row2;
      });
    }

    for (let cell of cellsPlayedState) {
      sortedWord += cell.value;
    }

    sendWord([sortedWord], wsRef);
  }
}

async function sendWord(words, wsRef) {
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

// function getSurrNonPlayedCells(cell, playedOnly = false) {
//   const { row, column } = getIndexByCell(cell);
//   const gridSize = cellDOMRefs.current.length;

//   let output = {
//     cols: [],
//     rows: [],
//   };

//   if (
//     row + 1 < gridSize &&
//     (!playedOnly || cellDOMRefs.current[row + 1][column].current.value !== "")
//   ) {
//     output["cols"].push(cellDOMRefs.current[row + 1][column].current);
//   }
//   if (
//     row - 1 > 0 &&
//     (!playedOnly || cellDOMRefs.current[row - 1][column].current.value !== "")
//   ) {
//     output["cols"].push(cellDOMRefs.current[row - 1][column].current);
//   }
//   if (
//     column - 1 > 0 &&
//     (!playedOnly || cellDOMRefs.current[row][column - 1].current.value !== "")
//   ) {
//     output["rows"].push(cellDOMRefs.current[row][column - 1].current);
//   }
//   if (
//     column + 1 < gridSize &&
//     (!playedOnly || cellDOMRefs.current[row][column + 1].current.value !== "")
//   ) {
//     output["rows"].push(cellDOMRefs.current[row][column + 1].current);
//   }
//   return output;
// }

// export const getClusterAxisBorderByCell = ({ cell, axis }) => {
//   let { row, column } = getIndexByCell(cell);

//   let border = getClusterBorderByCell();

//   for (let curCel of border) {
//     let { row: curRow, column: curCol } = getIndexByCell(curCel);

//     if (axis === "row" && curRow !== row) {
//       border.delete(curCel);
//     } else if (axis === "column" && curCol !== column) {
//       border.delete(curCel);
//     }
//   }
//   return border;
// };

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
