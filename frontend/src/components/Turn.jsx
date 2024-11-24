import { handleSubmission } from "../utils/utils.js";
import { useContext } from "react";
import { GameContext } from "../contexts/gameContext";

export const CompleteTurn = () => {
  const { playersTurn, setPlayersTurn, wsRef, cellsPlayedState, cellDOMRefs } =
    useContext(GameContext);

  let message = "Complete Turn";
  if (playersTurn === 1) {
    message = "Complete Turn";
  } else if (playersTurn === 0) {
    message = "Waiting for opponents move...";
  }

  const handleClick = () => {
    handleSubmission(
      cellsPlayedState,
      wsRef,
      setPlayersTurn,
      cellDOMRefs.current,
    );
  };

  return (
    <button
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      disabled={playersTurn !== 1}
      onClick={handleClick}
    >
      {message}
    </button>
  );
};
