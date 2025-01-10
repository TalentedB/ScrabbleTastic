import { useContext } from "react";
import { GameContext } from "../contexts/gameContext";

export const Points = ({ user }) => {
  const { playersPoints } = useContext(GameContext);
  return <div>{playersPoints[user]}</div>;
};
