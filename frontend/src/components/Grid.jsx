import "../css/Grid.css";
import React, { useEffect, useState } from "react";
import {
  clearHighlight,
  keepEnabled,
  getIndexByCell,
  highlightRow,
  highlightCol,
  getCell,
  addCell,
} from "../utils/utils.js";

export const Grid = ({ lettersAvailable, setLettersAvailable }) => {
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
              setGridsPlayed={setGridsPlayed}
              gridsPlayed={gridsPlayed}
              lettersAvailable={lettersAvailable}
              setLettersAvailable={setLettersAvailable}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const Cell = ({
  row,
  column,
  setGridsPlayed,
  gridsPlayed,
  lettersAvailable,
  setLettersAvailable,
}) => {
  const handleKeyPress = (event) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      setLettersAvailable([...lettersAvailable, event.target.value]);
      setGridsPlayed(gridsPlayed.filter((item) => item !== event.target));
      event.target.value = "";
    } else if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
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
    } else {
      if (
        lettersAvailable.includes(event.key.toUpperCase()) &&
        event.target.value === ""
      ) {
        addCell(event, gridsPlayed, setGridsPlayed);
        event.target.value = event.key.toUpperCase();
        let newLettersAvailable = [];
        let removed = false;

        for (let char of lettersAvailable) {
          if (char === event.key.toUpperCase() && !removed) {
            removed = true;
          } else {
            newLettersAvailable.push(char);
          }
        }
        setLettersAvailable(newLettersAvailable);
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
      readOnly
    />
  );
};
