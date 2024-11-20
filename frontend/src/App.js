import "./css/App.css";
import { Grid } from "./components/Grid.jsx";
import { HealthBar } from "./components/HealthBar.jsx";
import { LettersAvailable } from "./components/LettersAvailable.jsx";
import { useEffect, useState } from "react";
import { generateRandomLetters } from "./utils/utils.js";

function App() {
  const [lettersAvailable, setLettersAvailable] = useState([]);
  useEffect(() => {
    setLettersAvailable(generateRandomLetters(7));
  }, []);
  return (
    <div className="App">
      <h1 className="text-xl">Realtime Scrabble</h1>
      <div className="flex justify-around items-center">
        <HealthBar />
        <Grid
          lettersAvailable={lettersAvailable}
          setLettersAvailable={setLettersAvailable}
        />
        <HealthBar />
      </div>
      <LettersAvailable lettersAvailable={lettersAvailable} />
    </div>
  );
}

export default App;
