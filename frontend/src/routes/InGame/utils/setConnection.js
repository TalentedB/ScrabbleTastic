import {
  BOARD_ACTIONS,
  CELLS_PLAYED_ACTIONS,
  LETTERS_AVAILABLE_ACTIONS,
  TURNS,
} from "./constants.js";
import {
  disableCharactersPlayed,
  highlightAndEnableOnlyAdjacentCellsToWordsPlayed,
  clearHighlight,
  updateDisplayGrid,
} from "./utils.js";

export const setConnection = (
  wsRef,
  setPlayersTurn,
  boardDispatch,
  lettersAvailableDispatch,
  setIsConnectionOpen,
  cellsPlayedDispatch,
  setPlayersPoints,
  setPlayerGameHistory,
  setInvalidWords,
) => {
  const ws = new WebSocket("ws://localhost:8080");
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("WebSocket connection opened");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    // Invalid Moves
    if ("validity" in data) {
      console.log(data.validity);
      setPlayersTurn(TURNS.USER);

      const invalidWords = [];

      for (let word in data.validity) {
        console.log(word);
        if (!data.validity[word]) {
          invalidWords.push(word);
        }
      }
      console.log(invalidWords);
      setInvalidWords(invalidWords);
      console.log("Invalid Move");
    } else {
      setPlayersPoints({
        You: data.playersPoints,
        Opponent: data.opponentPoints,
      });
      setPlayerGameHistory({
        You: data.playHistory,
        Opponent: data.opponentHistory,
      });
      if (data.turn === TURNS.USER) {
        cellsPlayedDispatch(CELLS_PLAYED_ACTIONS.CLEAR);
        setPlayersTurn(TURNS.USER);
        disableCharactersPlayed(data.board); // Can't use boardState due to boardDispatch getting called after`
        updateDisplayGrid(data.board); // I need this here because highlightAnd... gets called before updateDisplayGrid
        highlightAndEnableOnlyAdjacentCellsToWordsPlayed();
      } else {
        console.log("generated letters");
        // lettersAvailableDispatch({
        //   type: LETTERS_AVAILABLE_ACTIONS.GENERATE_LETTERS,
        // });
        clearHighlight();
      }
      lettersAvailableDispatch({
        type: LETTERS_AVAILABLE_ACTIONS.INPUT_LETTERS,
        payload: data.lettersAvailable,
      });

      boardDispatch({ type: BOARD_ACTIONS.SET_BOARD, payload: data.board });
    }
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
