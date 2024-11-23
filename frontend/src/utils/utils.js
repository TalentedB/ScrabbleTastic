// Letters Utils
import { LETTERS } from "./constants.js";

export function generateRandomLetters(samples = 1) {
  const randomLetters = [];
  for (let i = 0; i < samples; i++) {
    randomLetters.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
  }
  return randomLetters;
}

// REWRITE ALL OF THIS
const getGridSingleton = (function () {
  let instance;

  class getGridSingletonClass {
    constructor(gridArray) {
      this.gridArray = gridArray;
    }

    getGrid() {
      return this.gridArray;
    }
  }

  function createGridArray() {
    const gridElement = document.getElementById("grid");
    if (!gridElement) {
      throw new Error("Grid element not found");
    }

    const rows = gridElement.children;
    const gridArray = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].children;
      const rowArray = [];
      for (let j = 0; j < row.length; j++) {
        rowArray.push(row[j]);
      }
      gridArray.push(rowArray);
    }

    return gridArray;
  }

  function getGridFunction() {
    if (!instance) {
      const gridArray = createGridArray();
      instance = new getGridSingletonClass(gridArray);
    }
    return instance.getGrid();
  }

  return {
    getGrid: getGridFunction,
  };
})();

export const getGrid = getGridSingleton.getGrid;

export function getCell(i, j) {
  return document.getElementById("grid").children[i].children[j];
}

export function keepEnabled(row, column) {
  // cellRefs.current;
  const grid = getGrid();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (
        i === row ||
        j === column ||
        (Object.is(row, null) && Object.is(column, null))
      ) {
        grid[i][j].disabled = false;
      } else {
        grid[i][j].disabled = true;
      }
    }
  }
}

export function getIndexByCell(cell) {
  const row = parseInt(cell.getAttribute("data-row"));
  const column = parseInt(cell.getAttribute("data-column"));
  return { row, column };
}

export function highlightRow(i) {
  const grid = getGrid();
  const gridRow = grid[i];
  for (const el of gridRow) {
    highlightCell(el, true);
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
function enableOnlyCells(cells, enable) {
  const grid = getGrid();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (cells.has(grid[i][j])) {
        grid[i][j].disabled = !enable;
      } else {
        grid[i][j].disabled = enable;
      }
    }
  }
}

export function makeThingsWork(board) {
  updateBoard(board);
  let border = getClusterBorderByCell();

  highlightCells(border, true);
  enableOnlyCells(border, true);
}

export function highlightCol(j) {
  const grid = getGrid();
  const gridCol = getColumn(grid, j);
  for (const el of gridCol) {
    highlightCell(el, true);
  }
}

export function clearHighlight() {
  const grid = getGrid();
  for (const row of grid) {
    for (const el of row) {
      highlightCell(el, false);
    }
  }
}

export function getSurroundingCells(cell, playedOnly = false) {
  const { row, column } = getIndexByCell(cell);
  const grid = getGrid();
  const gridSize = grid.length;

  let output = {
    cols: [],
    rows: [],
  };

  if (
    row + 1 < gridSize &&
    (!playedOnly || grid[row + 1][column].value !== "")
  ) {
    output["cols"].push(grid[row + 1][column]);
  }
  if (row - 1 > 0 && (!playedOnly || grid[row - 1][column].value !== "")) {
    output["cols"].push(grid[row - 1][column]);
  }
  if (column - 1 > 0 && (!playedOnly || grid[row][column - 1].value !== "")) {
    output["rows"].push(grid[row][column - 1]);
  }
  if (
    column + 1 < gridSize &&
    (!playedOnly || grid[row][column + 1].value !== "")
  ) {
    output["rows"].push(grid[row][column + 1]);
  }
  return output;
}

export function standardizeGrid(grid) {
  const standardizedGrid = [];
  for (let row of grid) {
    const standardizedRow = [];
    for (let cell of row) {
      standardizedRow.push(cell.value);
    }
    standardizedGrid.push(standardizedRow);
  }
  return standardizedGrid;
}

export function updateBoard(board) {
  const grid = getGrid();
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      grid[i][j].value = board[i][j];
    }
  }
}

export function handleSubmission(cellsPlayedState, wsRef, setPlayersTurn) {
  if (cellsPlayedState.length === 0) {
    console.log("Invalid"); // TODO: Add red everywhere for invalid entry
  } else if (cellsPlayedState.length === 1) {
    setPlayersTurn(0);
    sendWord([cellsPlayedState[0]], wsRef);
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

    sendWord([sortedWord], wsRef, setPlayersTurn);
  }
}

const sendWord = async (words, wsRef, setPlayersTurn) => {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({ board: standardizeGrid(getGrid()), words: words }),
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
const getCluster = () => {
  let grid = getGrid();
  let cluster = new Set();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j].value !== "") {
        cluster.add(grid[i][j]);
      }
    }
  }
  return cluster;
};

export const getClusterBorderByCell = () => {
  let cluster = getCluster();
  console.log(cluster);
  let border = new Set();

  for (let curCel of cluster) {
    let surroundingCells = getSurroundingCells(curCel, false);
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
