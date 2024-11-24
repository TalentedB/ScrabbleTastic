// Letters Utils
import { LETTERS } from "./constants.js";

export function generateRandomLetters(samples = 1) {
  const randomLetters = [];
  for (let i = 0; i < samples; i++) {
    randomLetters.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  }
  return randomLetters;
}

export function getCell(i, j) {
  return document.getElementById("grid").children[i].children[j];
}

export function keepEnabled(row, column, cellDOMRefs) {
  for (let i = 0; i < cellDOMRefs.length; i++) {
    for (let j = 0; j < cellDOMRefs[i].length; j++) {
      if (
        i === row ||
        j === column ||
        (Object.is(row, null) && Object.is(column, null))
      ) {
        cellDOMRefs[i][j].current.disabled = false;
      } else {
        cellDOMRefs[i][j].current.disabled = true;
      }
    }
  }
}

export function getIndexByCell(cell) {
  const row = parseInt(cell.getAttribute("data-row"));
  const column = parseInt(cell.getAttribute("data-column"));
  return { row, column };
}

export function highlightRow(i, cellDOMRefs) {
  const gridRow = cellDOMRefs[i];
  for (const el of gridRow) {
    highlightCell(el.current, true);
  }
}

export function getColumn(matrix, columnIndex) {
  return matrix.map((row) => row[columnIndex]);
}

function highlightCell(cell, on) {
  if (on) {
    cell.classList.add("highlight");
  } else {
    cell.classList.remove("highlight");
  }
}

function highlightCells(cells, on) {
  for (const cell of cells) {
    highlightCell(cell, on);
  }
}

// TODO - Get better name for this function
function enableOnlyCells(cells, enable, cellDOMRefs) {
  for (let i = 0; i < cellDOMRefs.length; i++) {
    for (let j = 0; j < cellDOMRefs[i].length; j++) {
      if (cells.has(cellDOMRefs[i][j].current)) {
        cellDOMRefs[i][j].current.disabled = !enable;
      } else {
        cellDOMRefs[i][j].current.disabled = enable;
      }
    }
  }
}

export function makeThingsWork(board, cellDOMRefs) {
  updateDisplayGrid(board);
  let border = getClusterBorderByCell(cellDOMRefs);

  highlightCells(border, true);
  enableOnlyCells(border, true, cellDOMRefs);
}

export function highlightCol(j, cellDOMRefs) {
  const gridCol = getColumn(cellDOMRefs, j);
  for (const el of gridCol) {
    highlightCell(el.current, true);
  }
}

export function clearHighlight(cellDOMRefs) {
  for (const row of cellDOMRefs) {
    for (const el of row) {
      highlightCell(el.current, false);
    }
  }
}

export function getSurroundingCells(cell, playedOnly = false, cellDOMRefs) {
  const { row, column } = getIndexByCell(cell);
  const gridSize = cellDOMRefs.length;

  let output = {
    cols: [],
    rows: [],
  };

  if (
    row + 1 < gridSize &&
    (!playedOnly || cellDOMRefs[row + 1][column].current.value !== "")
  ) {
    output["cols"].push(cellDOMRefs[row + 1][column].current);
  }
  if (
    row - 1 > 0 &&
    (!playedOnly || cellDOMRefs[row - 1][column].current.value !== "")
  ) {
    output["cols"].push(cellDOMRefs[row - 1][column].current);
  }
  if (
    column - 1 > 0 &&
    (!playedOnly || cellDOMRefs[row][column - 1].current.value !== "")
  ) {
    output["rows"].push(cellDOMRefs[row][column - 1].current);
  }
  if (
    column + 1 < gridSize &&
    (!playedOnly || cellDOMRefs[row][column + 1].current.value !== "")
  ) {
    output["rows"].push(cellDOMRefs[row][column + 1].current);
  }
  return output;
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

export function updateDisplayGrid(board, cellDOMRefs) {
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      cellDOMRefs[i][j].current.value = board[i][j];
    }
  }
}

export function handleSubmission(
  cellsPlayedState,
  wsRef,
  setPlayersTurn,
  cellDOMRefs,
) {
  if (cellsPlayedState.length === 0) {
    console.log("Invalid"); // TODO: Add red everywhere for invalid entry
  } else if (cellsPlayedState.length === 1) {
    setPlayersTurn(0);
    sendWord([cellsPlayedState[0]], wsRef, cellDOMRefs);
  } else {
    setPlayersTurn(0);
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

    sendWord([sortedWord], wsRef, cellDOMRefs);
  }
}

const sendWord = async (words, wsRef, cellDOMRefs) => {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({ board: standardizeGrid(cellDOMRefs), words: words }),
    );
  } else {
    console.error("WebSocket is not open");
  }
};

// const getClusterByCell = (cell, cluster = null) => {
//   cluster = cluster == null ? new Set() : cluster;

//   if (cluster.has(cell)) {
//     return cluster;
//   }

//   let surroundingCells = getSurroundingCells(cell, true);

//   for (let curCel of surroundingCells['rows']) {
//     cluster.add(curCel);
//     cluster = new Set([...cluster, ...getClusterByCell( curCel, cluster)]);
//   }
//   for (let curCel of surroundingCells['cols']) {
//     cluster.add(curCel);
//     cluster = new Set([...cluster, ...getClusterByCell(curCel, cluster)]);
//   }

// return cluster;
// }

// TODO: use useRef
const getCluster = (cellDOMRefs) => {
  let cluster = new Set();
  for (let i = 0; i < cellDOMRefs.length; i++) {
    for (let j = 0; j < cellDOMRefs[i].length; j++) {
      if (cellDOMRefs[i][j].current.value !== "") {
        cluster.add(cellDOMRefs[i][j].current);
      }
    }
  }
  return cluster;
};

export const getClusterBorderByCell = (cellDOMRefs) => {
  let cluster = getCluster(cellDOMRefs);
  console.log(cluster);
  let border = new Set();

  for (let curCel of cluster) {
    let surroundingCells = getSurroundingCells(curCel, false, cellDOMRefs);
    for (let surCel of surroundingCells["rows"]) {
      if (surCel.value === "") {
        border.add(surCel);
      }
    }
    for (let surCel of surroundingCells["cols"]) {
      if (surCel.value === "") {
        border.add(surCel);
      }
    }
  }

  return border;
};

export const getClusterAxisBorderByCell = ({ cell, axis }) => {
  let { row, column } = getIndexByCell(cell);

  let border = getClusterBorderByCell();

  for (let curCel of border) {
    let { row: curRow, column: curCol } = getIndexByCell(curCel);

    if (axis === "row" && curRow !== row) {
      border.delete(curCel);
    } else if (axis === "column" && curCol !== column) {
      border.delete(curCel);
    }
  }
  return border;
};
