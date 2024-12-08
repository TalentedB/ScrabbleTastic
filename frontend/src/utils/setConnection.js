import {
  BOARD_ACTIONS,
  CELLS_PLAYED_ACTIONS,
  LETTERS_AVAILABLE_ACTIONS,
  TURNS,
} from "./constants.js";
import {
  disableCharactersPlayed,
  highlightAdjacentCells,
  clearHighlight,
} from "./utils.js";

export const setConnection = (
  wsRef,
  cellDOMRefs,
  setPlayersTurn,
  boardDispatch,
  lettersAvailableDispatch,
  setIsConnectionOpen,
  cellsPlayedDispatch,
) => {
  const ws = new WebSocket("ws://localhost:8080");
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("WebSocket connection opened");
  };

  ws.onmessage = (event) => {
    console.log("initial message");
    console.log(cellDOMRefs);
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.turn === TURNS.USER) {
      cellsPlayedDispatch(CELLS_PLAYED_ACTIONS.CLEAR);
      setPlayersTurn(TURNS.USER);
      disableCharactersPlayed(data.board); // Can't use boardState due to boardDispatch getting called after`
      highlightAdjacentCells(data.board);
    } else {
      console.log("generated letters");
      lettersAvailableDispatch({
        type: LETTERS_AVAILABLE_ACTIONS.GENERATE_LETTERS,
      });
      clearHighlight();
    }

    boardDispatch({ type: BOARD_ACTIONS.SET_BOARD, payload: data.board });

    if (data.validity !== undefined) {
      setPlayersTurn(TURNS.USER);
    }

    console.log(data);
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
    setIsConnectionOpen(false);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  return () => {
    ws.close();
  };
};
