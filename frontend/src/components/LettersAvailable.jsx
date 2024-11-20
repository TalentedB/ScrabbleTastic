export const LettersAvailable = ({ lettersAvailable }) => {
  return (
    <div className="flex justify-around w-1/2 content-center mx-auto mt-5 bg-amber-900 p-1">
      {lettersAvailable.map((letter) => (
        <div className="border bg-amber-200 border-black w-8 h-8 text-center text-base">
          {letter}
        </div>
      ))}
    </div>
  );
};
