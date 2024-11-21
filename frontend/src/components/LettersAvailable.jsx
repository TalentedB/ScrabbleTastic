import "../css/LettersAvailable.css";
export const LettersAvailable = ({ lettersAvailable }) => {
  return (
    <div className="flex justify-around w-1/2 content-center mx-auto mt-5 bg-amber-900 p-1 h-10 holder">
      {lettersAvailable.map((letter) => (
        <div className="border bg-amber-200 border-black w-8 h-8 text-center text-base piece">
          {letter}
        </div>
      ))}
    </div>
  );
};
