import { GameHistory } from "./GameHistory";

export const GameHistorySection = () => {
  return (
    <div className="bg-black flex flex-col items-center justify-around h-40">
      <h1 className="text-xl text-white font-bold ">Game History</h1>
      <div className="flex justify-around gap-x-20 w-full">
        <GameHistory user="You" />
        <GameHistory user="Opponent" />
      </div>
    </div>
  );
};
