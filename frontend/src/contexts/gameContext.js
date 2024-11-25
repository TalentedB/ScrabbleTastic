import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useReducer,
  useLayoutEffect,
} from "react";
import {
  boardReducer,
  cellsPlayedReducer,
  lettersAvailableReducer,
} from "../utils/reducers.js";
import {
  clearHighlight,
  makeThingsWork,
  setCellDOMRefs,
  updateDisplayGrid,
} from "../utils/utils.js";
import { BOARD_ACTIONS } from "../utils/constants.js";

// Create the context
export const GameContext = createContext();

// ThemeProvider component to wrap around your app
export const GameProvider = ({ children }) => {
  const [playersTurn, setPlayersTurn] = useState(1);
  const cellDOMRefs = useRef(
    Array.from({ length: 15 }, () => {
      return Array.from({ length: 15 }, () => React.createRef());
    }),
  );

  const wsRef = useRef(null);
  const [lettersAvailableState, lettersAvailableDispatch] = useReducer(
    lettersAvailableReducer,
    [],
  );
  const [cellsPlayedState, cellsPlayedDispatch] = useReducer(
    cellsPlayedReducer,
    [],
  );
  const [boardState, boardDispatch] = useReducer(
    boardReducer,
    Array.from({ length: 15 }, () => Array(15).fill("")),
  );

  useLayoutEffect(() => {
    setCellDOMRefs(cellDOMRefs);
    lettersAvailableDispatch({ type: "generateLetters" });

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
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    // What is playable
    updateDisplayGrid(boardState);
  }, [boardState]);

  return (
    <GameContext.Provider
      value={{
        wsRef,
        cellDOMRefs,
        playersTurn,
        boardDispatch,
        setPlayersTurn,
        lettersAvailableState,
        lettersAvailableDispatch,
        cellsPlayedState,
        cellsPlayedDispatch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
