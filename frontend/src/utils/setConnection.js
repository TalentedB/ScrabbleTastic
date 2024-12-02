import { BOARD_ACTIONS } from "./constants.js";
import {
  disableCharactersPlayed,
  makeThingsWork,
  clearHighlight,
} from "./utils.js";

export const setConnection = (
  wsRef,
  cellDOMRefs,
  setPlayersTurn,
  boardDispatch,
  lettersAvailableDispatch,
  setIsConnectionOpen,
) => {
  const ws = new WebSocket("ws://localhost:8080");
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("WebSocket connection opened");
  };

  ws.onmessage = (event) => {
    console.log(cellDOMRefs);
    const data = JSON.parse(event.data);
    if (data.turn === 1) {
      setPlayersTurn(1);
      boardDispatch({ type: BOARD_ACTIONS.SET_BOARD, payload: data.board });
      disableCharactersPlayed(data.board); // Can't use boardState do to boardDispatch getting called after`
      makeThingsWork(data.board);
    } else {
      lettersAvailableDispatch({ type: "generateLetters" });
      clearHighlight();
    }

    if (data.validity !== undefined) {
      setPlayersTurn(1);
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
