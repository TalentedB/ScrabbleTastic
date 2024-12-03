import { handleSubmission } from "../utils/utils.js";
import { useContext } from "react";
import { GameContext } from "../contexts/gameContext";
import { TURNS } from "../utils/constants.js";

export const CompleteTurn = () => {
  const { playersTurn, setPlayersTurn, wsRef, cellsPlayedState } =
    useContext(GameContext);

  let message = "Complete Turn";
  if (playersTurn === TURNS.USER) {
    message = "Complete Turn";
  } else if (playersTurn === TURNS.OPPONENT) {
    message = "Waiting for opponents move...";
  }

  const handleClick = () => {
    handleSubmission(cellsPlayedState, wsRef, setPlayersTurn);
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
