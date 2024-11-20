import "./Grid.css";
import React, { useEffect, useState } from "react";

function getGrid() {
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

function getCell(i, j) {
  return document.getElementById("grid").children[i].children[j];
}

function keepEnabled(row, column) {
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

function getIndexByCell(cell) {
  const row = parseInt(cell.getAttribute("data-row"));
  const column = parseInt(cell.getAttribute("data-column"));
  return { row, column };
}

function highlightRow(i) {
  const grid = getGrid();
  const gridRow = grid[i];
  for (const el of gridRow) {
    el.classList.add("highlight");
  }
}

function getColumn(matrix, columnIndex) {
  return matrix.map((row) => row[columnIndex]);
}

function highlightCol(j) {
  const grid = getGrid();
  const gridCol = getColumn(grid, j);
  for (const el of gridCol) {
    el.classList.add("highlight");
  }
}

function clearHighlight() {
  const grid = getGrid();
  for (const row of grid) {
    for (const el of row) {
      el.classList.remove("highlight");
    }
  }
}

export const Grid = () => {
  const [gridsPlayed, setGridsPlayed] = useState([]);
  useEffect(() => {
    console.log(gridsPlayed);
    clearHighlight();
    keepEnabled(null, null);
    if (gridsPlayed.length === 1) {
      const { row, column } = getIndexByCell(gridsPlayed[0]);
      highlightRow(row);
      highlightCol(column);
      keepEnabled(row, column);
    } else if (gridsPlayed.length > 1) {
      console.log(gridsPlayed[1]);
      const { row: row1, column: col1 } = getIndexByCell(gridsPlayed[0]);
      const { row: row2, column: col2 } = getIndexByCell(gridsPlayed[1]);
      if (row1 === row2) {
        highlightRow(row1);
        keepEnabled(row1, null);
      } else {
        highlightCol(col1);
        keepEnabled(null, col2);
      }
    }
  }, [gridsPlayed]);

  function addCell(event) {
    setGridsPlayed([...gridsPlayed, event.target]);
  }

  const temp = new Array(225).fill(0);
  const rows = [];

  for (let i = 0; i < temp.length; i += 15) {
    rows.push(temp.slice(i, i + 15));
  }

  return (
    <div className="grid gap-0" id="grid">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-15 gap-0">
          {row.map((_, index) => (
            <Cell
              row={rowIndex}
              column={index}
              addCell={addCell}
              setGridsPlayed={setGridsPlayed}
              gridsPlayed={gridsPlayed}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Cell = ({ row, column, addCell, setGridsPlayed, gridsPlayed }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      setGridsPlayed(gridsPlayed.filter((item) => item !== event.target));
      event.target.value = "";
    } else {
      const { row, column } = getIndexByCell(event.target);
      if (event.key === "ArrowUp") {
        let cell = getCell(row - 1, column);
        cell.focus();
        cell.select();
      } else if (event.key === "ArrowDown") {
        let cell = getCell(row + 1, column);
        cell.focus();
        cell.select();
      } else if (event.key === "ArrowLeft") {
        let cell = getCell(row, column - 1);
        cell.focus();
        cell.select();
      } else if (event.key === "ArrowRight") {
        let cell = getCell(row, column + 1);
        cell.focus();
        cell.select();
      }
    }
  };
  return (
    <input
      className="border border-black w-10 h-10 text-center uppercase grid-item focus:border-blue-500 outline-none"
      data-row={row}
      data-column={column}
      maxLength="1"
      tabIndex="0"
      onKeyDown={handleKeyPress}
      onChange={addCell}
    />
  );
};
