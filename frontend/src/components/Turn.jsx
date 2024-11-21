export const CompleteTurn = ({ curState }) => {
  let message = "Complete Turn";
  if (curState === "turn") {
    message = "Complete Turn";
  } else if (curState === "waiting") {
    message = "Waiting for opponents move...";
  }
  return (
    <button
      className="flex justify-around w-1/2 content-center mx-auto mt-5 bg-amber-900 p-1 h-10"
      disabled={curState !== "turn"}
    >
      {message}
    </button>
  );
};
