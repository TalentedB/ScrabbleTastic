import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useReducer,
} from "react";
import {
  cellsPlayedReducer,
  lettersAvailableReducer,
} from "../utils/reducers.js";
import { clearHighlight, makeThingsWork } from "../utils/utils.js";

// Create the context
export const GameContext = createContext();

// ThemeProvider component to wrap around your app
export const GameProvider = ({ children }) => {
  const [playersTurn, setPlayersTurn] = useState(1);
  const [board, setBoard] = useState(
    Array.from({ length: 15 }, () => Array(15).fill("")),
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
  useEffect(() => {
    lettersAvailableDispatch({ type: "generateLetters" });

    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.turn === 1) {
        setPlayersTurn(1);
        setBoard(data.board);
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

  return (
    <GameContext.Provider
      value={{
        wsRef,
        board,
        setBoard,
        playersTurn,
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
