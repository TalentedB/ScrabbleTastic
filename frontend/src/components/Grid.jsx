import "../css/Grid.css";
import React, { useEffect, useContext, useRef } from "react";
import { GameContext } from "../contexts/gameContext.js";
import { Cell } from "./Cell.jsx";

import {
  clearHighlight,
  keepEnabled,
  getIndexByCell,
  highlightRow,
  highlightCol,
  updateBoard,
} from "../utils/utils.js";

export const Grid = () => {
  const cellRefs = useRef(
    Array.from({ length: 15 }, () => {
      return Array.from({ length: 15 }, () => React.createRef());
    }),
  );
  // const cellRefs = Array.from({ length: 15 }, () => {
  //   return Array.from({ length: 15 }, () => React.createRef());
  // });
  const { board, cellsPlayedState } = useContext(GameContext);
  useEffect(() => {
    updateBoard(board);
  }, [board]);

  useEffect(() => {
    clearHighlight();
    keepEnabled(null, null);
    if (cellsPlayedState.length === 1) {
      const { row, column } = getIndexByCell(cellsPlayedState[0]);
      highlightRow(row);
      highlightCol(column);
      keepEnabled(row, column);
    } else if (cellsPlayedState.length > 1) {
      const { row: row1, column: col1 } = getIndexByCell(cellsPlayedState[0]);
      const { row: row2, column: col2 } = getIndexByCell(cellsPlayedState[1]);

      if (row1 === row2) {
        highlightRow(row1);
        keepEnabled(row1, null);
      } else {
        highlightCol(col1);
        keepEnabled(null, col2);
      }
    }
  }, [cellsPlayedState]);

  const temp = new Array(225).fill(0);
  const rows = [];

  for (let i = 0; i < temp.length; i += 15) {
    rows.push(temp.slice(i, i + 15));
  }

  return (
    <div className="grid gap-0" id="grid">
      {cellRefs.current.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-15 gap-0 row">
          {row.map((cellRef, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              column={colIndex}
              className="cell"
              ref={cellRef}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
