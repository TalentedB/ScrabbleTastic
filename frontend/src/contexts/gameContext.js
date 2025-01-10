import React, {
  createContext,
  useState,
  useRef,
  useReducer,
  useLayoutEffect,
} from "react";
import { LETTERS_AVAILABLE_ACTIONS, TURNS } from "../utils/constants.js";
import {
  boardReducer,
  cellsPlayedReducer,
  lettersAvailableReducer,
} from "../utils/reducers.js";
import { setCellDOMRefs } from "../utils/utils.js";

// Create the context
export const GameContext = createContext();

// ThemeProvider component to wrap around your app
export const GameProvider = ({ children }) => {
  const [isConnectionOpen, setIsConnectionOpen] = useState(false);
  const [playersTurn, setPlayersTurn] = useState(TURNS.OPPONENT);
  const [playersPoints, setPlayersPoints] = useState({ You: 0, Opponent: 0 });
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
    lettersAvailableDispatch({
      type: LETTERS_AVAILABLE_ACTIONS.GENERATE_LETTERS,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        wsRef,
        playersPoints,
        boardState,
        cellDOMRefs,
        playersTurn,
        boardDispatch,
        setPlayersTurn,
        lettersAvailableState,
        lettersAvailableDispatch,
        cellsPlayedState,
        cellsPlayedDispatch,
        isConnectionOpen,
        setIsConnectionOpen,
        setPlayersPoints,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
