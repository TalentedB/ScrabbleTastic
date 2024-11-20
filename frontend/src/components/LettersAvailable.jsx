export const LettersAvailable = ({ lettersAvailable }) => {
  return (
    <div className="flex justify-around w-1/2 content-center mx-auto mt-5">
      {lettersAvailable.map((letter) => (
        <div className="border border-black w-8 h-8 text-center text-base">
          {letter}
        </div>
      ))}
    </div>
  );
};
