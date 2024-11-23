import React, { forwardRef, useContext } from "react";
import { GameContext } from "../contexts/gameContext.js";
import {
  getIndexByCell,
  getCell,
  getGrid,
  handleSubmission,
} from "../utils/utils.js";
import {
  CELLS_PLAYED_ACTIONS,
  LETTERS_AVAILABLE_ACTIONS,
} from "../utils/constants.js";

export const Cell = forwardRef(({ row, column }, ref) => {
  const {
    playersTurn,
    wsRef,
    setPlayersTurn,
    lettersAvailableDispatch,
    lettersAvailableState,
    cellsPlayedDispatch,
    cellsPlayedState,
  } = useContext(GameContext);

  const handleKeyPress = (event) => {
    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      event.target.value !== "" &&
      playersTurn === 1
    ) {
      lettersAvailableDispatch({
        type: LETTERS_AVAILABLE_ACTIONS.ADD_LETTER,
        payload: event.target.value,
      });
      event.target.value = "";
      cellsPlayedDispatch({
        type: CELLS_PLAYED_ACTIONS.REMOVE_CELL,
        payload: event.target,
      });
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
    } else if (event.key === "Enter" && playersTurn === 1) {
      handleSubmission(cellsPlayedState, wsRef, setPlayersTurn);
    } else {
      if (
        lettersAvailableState.includes(event.key.toUpperCase()) &&
        event.target.value === ""
      ) {
        cellsPlayedDispatch({
          type: CELLS_PLAYED_ACTIONS.ADD_CELL,
          payload: event.target,
        });
        lettersAvailableDispatch({
          type: LETTERS_AVAILABLE_ACTIONS.REMOVE_LETTER,
          payload: event,
        });
      }
    }
  };

  return (
    <input
      className="border border-black w-10 h-10 text-center uppercase grid-item focus:border-blue-500 outline-none"
      data-row={row}
      data-column={column}
      disabled={playersTurn !== 1}
      maxLength="1"
      tabIndex="0"
      onKeyDown={handleKeyPress}
      ref={ref}
      readOnly
    />
  );
});
