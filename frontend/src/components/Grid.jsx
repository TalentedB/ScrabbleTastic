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
  getGrid,
  standardizeGrid,
  updateBoard,
} from "../utils/utils.js";

const handleEnter = (gridsPlayed, wsRef) => {
  if (gridsPlayed.length === 0) {
    console.log("Invalid"); // TODO: Add red everywhere for invalid entry
  } else if (gridsPlayed.length === 1) {
    sendWord([gridsPlayed[0]], wsRef);
  } else {
    // We need to sort by row or column
    let sortedWord = "";

    // Check to see if we are sorted by row or column
    if (
      gridsPlayed[0].getAttribute("data-row") ===
      gridsPlayed[1].getAttribute("data-row")
    ) {
      gridsPlayed.sort((cell1, cell2) => {
        const { column: col1 } = getIndexByCell(cell1);
        const { column: col2 } = getIndexByCell(cell2);
        return col1 - col2;
      });
    } else {
      gridsPlayed.sort((cell1, cell2) => {
        const { row: row1 } = getIndexByCell(cell1);
        const { row: row2 } = getIndexByCell(cell2);
        return row1 - row2;
      });
    }

    for (let cell of gridsPlayed) {
      sortedWord += cell.value;
    }

    sendWord([sortedWord], wsRef);
  }
};

const sendWord = async (words, wsRef) => {
  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({ board: standardizeGrid(getGrid()), words: words }),
    );
  } else {
    console.error("WebSocket is not open");
  }
};

export const Grid = ({
  lettersAvailable,
  setLettersAvailable,
  wsRef,
  board,
}) => {
  const [gridsPlayed, setGridsPlayed] = useState([]);
  useEffect(() => {
    console.log("hi");
    updateBoard(board);
  }, [board]);

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
              wsRef={wsRef}
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
  wsRef,
}) => {
  const handleKeyPress = (event) => {
    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      event.target.value !== ""
    ) {
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
      if (event.key === "ArrowUp" && row > 0) {
        let cell = getCell(row - 1, column);
        cell.focus();
        cell.select();
      } else if (event.key === "ArrowDown" && row < getGrid().length - 1) {
        let cell = getCell(row + 1, column);
        cell.focus();
        cell.select();
      } else if (event.key === "ArrowLeft" && column > 0) {
        let cell = getCell(row, column - 1);
        cell.focus();
        cell.select();
      } else if (event.key === "ArrowRight" && column < getGrid().length - 1) {
        let cell = getCell(row, column + 1);
        cell.focus();
        cell.select();
      }
    } else if (event.key === "Enter") {
      handleEnter(gridsPlayed, wsRef);
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
