import { useContext } from "react";
import "../css/LettersAvailable.css";
import { GameContext } from "../contexts/gameContext";
import Draggable from "react-draggable";
import {
  BOARD_ACTIONS,
  LETTERS_AVAILABLE_ACTIONS,
} from "../utils/constants.js";

export const LettersAvailable = () => {
  const {
    lettersAvailableState,
    boardDispatch,
    lettersAvailableDispatch,
    cellDOMRefs,
  } = useContext(GameContext);

  const checkOverlap = (cell, tilePosition) => {
    const cellBottom = cell.offsetTop + cell.offsetHeight;
    const cellRight = cell.offsetLeft + cell.offsetWidth;
    const { clientX: tileX, clientY: tileY } = tilePosition;
    return (
      cell.offsetLeft <= tileX &&
      cellRight >= tileX &&
      cell.offsetTop <= tileY &&
      cellBottom >= tileY
    );
  };

  const handleStop = (e) => {
    const tileValue = e.toElement.innerText.toUpperCase();

    for (let i = 0; i < cellDOMRefs.current.length; i++) {
      for (let j = 0; j < cellDOMRefs.current.length; j++) {
        if (
          cellDOMRefs.current[i][j].current.value === "" &&
          checkOverlap(cellDOMRefs.current[i][j].current, e)
        ) {
          lettersAvailableDispatch({
            type: LETTERS_AVAILABLE_ACTIONS.REMOVE_LETTER,
            payload: tileValue,
          });
          boardDispatch({
            type: BOARD_ACTIONS.MODIFY_INDEX,
            payload: {
              row: i,
              col: j,
              newValue: tileValue,
            },
          });
        }
      }
    }
  };

  return (
    <div className="flex justify-around w-1/2 content-center mx-auto mt-5 bg-amber-900 p-1 h-10 holder">
      {lettersAvailableState
        ? lettersAvailableState.map((letter) => (
            <Draggable onStop={handleStop} position={{ x: 0, y: 0 }}>
              <div className="border bg-amber-200 border-black w-8 h-8 text-center text-base piece">
                {letter}
              </div>
            </Draggable>
          ))
        : null}
    </div>
  );
};
