// Letters Utils
export function generateRandomLetters(samples = 1) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = [];
  for (let i = 0; i < samples; i++) {
    randomLetters.push(letters[Math.floor(Math.random() * letters.length)]);
  }
  return randomLetters;
}

// Grid Utils
export function getGrid() {
  const gridElement = document.getElementById("grid");
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

export function addCell(event, gridsPlayed, setGridsPlayed) {
  setGridsPlayed([...gridsPlayed, event.target]);
}
