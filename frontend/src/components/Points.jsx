import { useContext } from "react";
import { GameContext } from "../contexts/gameContext";

export const Points = ({ user }) => {
  const { playerPoints } = useContext(GameContext);
  return <div>{playerPoints[user]}</div>;
};
