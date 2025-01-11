import React, { useContext } from "react";
import { GameContext } from "../contexts/gameContext.js";

export const GameHistory = ({ user }) => {
  const { playerGameHistory } = useContext(GameContext);

  return (
    <div className="text-center text-white w-1/3 border-4">
      <h2>{user}</h2>
      <ol className="list-decimal">
        {playerGameHistory[user].map((play) => {
          return <li>{play.join(", ")}</li>;
        })}
      </ol>
    </div>
  );
};
