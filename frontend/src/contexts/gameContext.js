import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useReducer,
  useLayoutEffect,
} from "react";
import { LETTERS_AVAILABLE_ACTIONS, TURNS } from "../utils/constants.js";
import {
  boardReducer,
  cellsPlayedReducer,
  lettersAvailableReducer,
} from "../utils/reducers.js";
import {
  disableBoard,
  setCellDOMRefs,
  updateDisplayGrid,
} from "../utils/utils.js";

// Create the context
export const GameContext = createContext();

// ThemeProvider component to wrap around your app
export const GameProvider = ({ children }) => {
  const [isConnectionOpen, setIsConnectionOpen] = useState(false);
  const [playersTurn, setPlayersTurn] = useState(TURNS.OPPONENT);
  const [playerPoints, setPlayerPoints] = useState({ 1: 0, 2: 0 });
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

  useEffect(() => {
    if (playersTurn === TURNS.OPPONENT) {
      disableBoard();
    }
  }, [playersTurn]);

  useEffect(() => {
    updateDisplayGrid(boardState);
  }, [boardState]);

  return (
    <GameContext.Provider
      value={{
        wsRef,
        playerPoints,
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
