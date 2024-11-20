import "./Grid.css";
import React, { useEffect, useState } from "react";
import {
  clearHighlight,
  keepEnabled,
  getIndexByCell,
  highlightRow,
  highlightCol,
  getCell,
} from "./utils.js";

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
