import "./css/App.css";
import { CompleteTurn } from "./components/Turn.jsx";
import { Grid } from "./components/Grid.jsx";
import { LettersAvailable } from "./components/LettersAvailable.jsx";
import { GameProvider } from "./contexts/gameContext.js";
import { Status } from "./components/Status.jsx";
import { GameHistorySection } from "./components/GameHistorySection.jsx";

function App() {
  return (
    <GameProvider>
      <div className="App bg-blue-300">
        <h1 className="text-xl text-blue-600 font-bold">Realtime Scrabble</h1>
        <div className="flex justify-around items-center">
          <Status user="You" />
          <Grid />
          <Status user="Opponent" />
        </div>
        <LettersAvailable />
        <CompleteTurn />
      </div>
      <GameHistorySection />
    </GameProvider>
  );
}

export default App;
