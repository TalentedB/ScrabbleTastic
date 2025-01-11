import { handleSubmission } from "../utils/utils.js";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../contexts/gameContext.js";
import { TURNS } from "../utils/constants.js";

export const CompleteTurn = () => {
  const { playersTurn, setPlayersTurn, wsRef, cellsPlayedState, debugMode } =
    useContext(GameContext);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (playersTurn === TURNS.USER) {
      setMessage("Complete Turn");
    } else if (playersTurn === TURNS.OPPONENT) {
      setMessage("Waiting for opponents move...");
    }
  }, [playersTurn]);

  const handleClick = () => {
    handleSubmission(cellsPlayedState, wsRef, setPlayersTurn, debugMode);
  };

  return (
    <button
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      disabled={playersTurn === TURNS.OPPONENT}
      onClick={handleClick}
    >
      {message}
    </button>
  );
};
