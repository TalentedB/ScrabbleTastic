// Letters Utils
const distribution = {
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

for (const key in distribution) {
  letters += key.repeat(distribution[key]);
}

export function generateRandomLetters(samples = 1) {
  const randomLetters = [];
  for (let i = 0; i < samples; i++) {
    randomLetters.push(letters[Math.floor(Math.random() * letters.length)]);
  }
  return randomLetters;
}

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
    el.classList.add("highlight");
  }
}

export function getColumn(matrix, columnIndex) {
  return matrix.map((row) => row[columnIndex]);
}

export function highlightCol(j) {
  const grid = getGrid();
  const gridCol = getColumn(grid, j);
  for (const el of gridCol) {
    el.classList.add("highlight");
  }
}

export function clearHighlight() {
  const grid = getGrid();
  for (const row of grid) {
    for (const el of row) {
      el.classList.remove("highlight");
    }
  }
}

export function getSurroundingCells(cell, nonPlayed = false) {
  const { row, column } = getIndexByCell(cell);
  const grid = getGrid();
  const gridSize = grid.length;

  let output = [];
  if (row + 1 < gridSize) {
    output.append(grid[row + 1][column]);
  }
  if (row - 1 > 0) {
    output.append(grid[row - 1][column]);
  }
  if (column - 1 > 0) {
    output.append(grid[row][column - 1]);
  }
  if (column + 1 < gridSize) {
    output.append(grid[row][column + 1]);
  }
}

export function addCell(event, gridsPlayed, setGridsPlayed) {
  setGridsPlayed([...gridsPlayed, event.target]);
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
