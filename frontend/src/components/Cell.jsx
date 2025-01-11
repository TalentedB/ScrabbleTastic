import React, { forwardRef, useContext } from "react";
import { GameContext } from "../contexts/gameContext.js";
import { getIndexByCell, handleSubmission } from "../utils/utils.js";
import { TURNS, LETTERS } from "../utils/constants.js";
import {
  BOARD_ACTIONS,
  CELLS_PLAYED_ACTIONS,
  LETTERS_AVAILABLE_ACTIONS,
} from "../utils/constants.js";

export const Cell = forwardRef(({ row, column }, ref) => {
  const {
    playersTurn,
    wsRef,
    cellDOMRefs,
    setPlayersTurn,
    lettersAvailableDispatch,
    lettersAvailableState,
    cellsPlayedDispatch,
    cellsPlayedState,
    boardDispatch,
    debugMode,
    setDebugMode,
  } = useContext(GameContext);

  const handleKeyPress = (event) => {
    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      event.target.value !== "" &&
      playersTurn === TURNS.USER
    ) {
      console.log(event.target.classList);
      if (!event.target.classList.contains("already-played")) {
        lettersAvailableDispatch({
          type: LETTERS_AVAILABLE_ACTIONS.ADD_LETTER,
          payload: event.target.value,
        });
        cellsPlayedDispatch({
          type: CELLS_PLAYED_ACTIONS.REMOVE_CELL,
          payload: event.target,
        });
        boardDispatch({
          type: BOARD_ACTIONS.MODIFY_INDEX,
          payload: {
            row: event.target.getAttribute("data-row"),
            col: event.target.getAttribute("data-column"),
            newValue: "",
          },
        });
      } else {
        console.log("cant play here");
      }
    } else if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      const { row, column } = getIndexByCell(event.target);
      if (event.key === "ArrowUp" && row > 0) {
        let cell = cellDOMRefs.current[row - 1][column].current;
        cell.focus();
        cell.select();
      } else if (
        event.key === "ArrowDown" &&
        row < cellDOMRefs.current.length - 1
      ) {
        let cell = cellDOMRefs.current[row + 1][column].current;
        cell.focus();
        cell.select();
      } else if (event.key === "ArrowLeft" && column > 0) {
        let cell = cellDOMRefs.current[row][column - 1].current;
        cell.focus();
        cell.select();
      } else if (
        event.key === "ArrowRight" &&
        column < cellDOMRefs.current.length - 1
      ) {
        let cell = cellDOMRefs.current[row][column + 1].current;
        cell.focus();
        cell.select();
      }
    } else if (event.key === "Enter" && playersTurn === TURNS.USER) {
      handleSubmission(cellsPlayedState, wsRef, setPlayersTurn, debugMode);
    } else if (event.key === "d" && event.ctrlKey && event.altKey) {
      if (debugMode) {
        console.log("Debug Mode is Off");
      } else {
        console.log("Debug Mode is On");
      }
      setDebugMode(!debugMode);
    } else {
      if (
        (lettersAvailableState.includes(event.key.toUpperCase()) ||
          (debugMode && LETTERS.includes(event.key.toUpperCase()))) &&
        event.target.value === ""
      ) {
        cellsPlayedDispatch({
          type: CELLS_PLAYED_ACTIONS.ADD_CELL,
          payload: event.target,
        });
        lettersAvailableDispatch({
          type: LETTERS_AVAILABLE_ACTIONS.REMOVE_LETTER,
          payload: event.key.toUpperCase(),
        });
        boardDispatch({
          type: BOARD_ACTIONS.MODIFY_INDEX,
          payload: {
            row: event.target.getAttribute("data-row"),
            col: event.target.getAttribute("data-column"),
            newValue: event.key.toUpperCase(),
          },
        });
      }
    }
  };

  return (
    <input
      className="border border-black w-10 h-10 text-center uppercase grid-item focus:border-blue-500 outline-none"
      data-row={row}
      data-column={column}
      disabled={playersTurn === TURNS.OPPONENT}
      maxLength="1"
      tabIndex="0"
      onKeyDown={handleKeyPress}
      ref={ref}
      readOnly
    />
  );
});
