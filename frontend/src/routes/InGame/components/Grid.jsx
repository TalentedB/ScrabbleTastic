import "../css/Grid.css";
import React, { useEffect, useContext } from "react";
import { GameContext } from "../contexts/gameContext.js";
import { Cell } from "./Cell.jsx";
import { LostConnectionModal } from "./Modals/LostConnectionModal.jsx";
import { InvalidMoveModal } from "./Modals/InvalidMoveModal.jsx";
import { setConnection } from "../utils/setConnection.js";
import { TURNS } from "../utils/constants.js";
import {
  clearHighlight,
  keepEnabled,
  getIndexByCell,
  highlightRow,
  highlightCol,
  highlightAndEnableOnlyAdjacentCellsToWordsPlayed,
  updateDisplayGrid,
  disableBoard,
  handlePlayed,
} from "../utils/utils.js";

export const Grid = () => {
  const {
    wsRef,
    setPlayersTurn,
    boardDispatch,
    lettersAvailableDispatch,
    cellsPlayedState,
    cellDOMRefs,
    isConnectionOpen,
    setIsConnectionOpen,
    playersTurn,
    cellsPlayedDispatch,
    boardState,
    setPlayersPoints,
    setPlayerGameHistory,
    invalidWords,
    setInvalidWords,
  } = useContext(GameContext);

  useEffect(() => {
    if (playersTurn === TURNS.USER) {
      clearHighlight();
      keepEnabled(null, null);
      updateDisplayGrid(boardState);
      if (cellsPlayedState.length === 0) {
        highlightAndEnableOnlyAdjacentCellsToWordsPlayed();
      }
      if (cellsPlayedState.length === 1) {
        const { row, column } = getIndexByCell(cellsPlayedState[0]);
        handlePlayed(row, column);
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
    } else {
      disableBoard();
    }
  }, [cellsPlayedState, playersTurn, boardState]);

  const temp = new Array(225).fill(0);
  const rows = [];

  for (let i = 0; i < temp.length; i += 15) {
    rows.push(temp.slice(i, i + 15));
  }

  return (
    <div className="grid gap-0" id="grid">
      {cellDOMRefs.current.map((row, rowIndex) => (
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
      {invalidWords.length !== 0 && (
        <InvalidMoveModal
          setFalse={() => {
            setInvalidWords([]);
          }}
          words={invalidWords}
        />
      )}
      {!isConnectionOpen && (
        <LostConnectionModal
          reconnect={() => {
            setConnection(
              wsRef,
              setPlayersTurn,
              boardDispatch,
              lettersAvailableDispatch,
              setIsConnectionOpen,
              cellsPlayedDispatch,
              setPlayersPoints,
              setPlayerGameHistory,
              setInvalidWords,
            );
            setIsConnectionOpen(true);
          }}
        />
      )}
    </div>
  );
};
