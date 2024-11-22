import "./css/App.css";
import { CompleteTurn } from "./components/Turn.jsx";
import { Grid } from "./components/Grid.jsx";
import { HealthBar } from "./components/HealthBar.jsx";
import { LettersAvailable } from "./components/LettersAvailable.jsx";
import { useEffect, useState, useRef } from "react";
import {
  clearHighlight,
  generateRandomLetters,
  updateBoard,
  makeThingsWork,
  getGrid
} from "./utils/utils.js";

function App() {
  const [gridsPlayed, setGridsPlayed] = useState([]);
  const [playersTurn, setPlayersTurn] = useState(1);
  const [board, setBoard] = useState(
    Array.from({ length: 15 }, () => Array(15).fill("")),
  );
  const wsRef = useRef(null);
  const [lettersAvailable, setLettersAvailable] = useState([]);
  useEffect(() => {
    setLettersAvailable(generateRandomLetters(7));
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.turn === 1) {
        setPlayersTurn(1);
        setBoard(data.board);
        makeThingsWork(data.board);
      } else {
        setLettersAvailable((prevLetters) => {
          console.log(prevLetters)
          const newLetters = [
            ...prevLetters,
            ...generateRandomLetters(7 - prevLetters.length),
          ];
          console.log(newLetters); // Logs the updated letters
          return newLetters;
        });
        clearHighlight();
      }

      if (data.validity !== undefined) {
        setPlayersTurn(1);
      }

      console.log(data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="App bg-blue-300">
      <h1 className="text-xl text-blue-600 font-bold">Realtime Scrabble</h1>
      <div className="flex justify-around items-center">
        <HealthBar />
        <Grid
          lettersAvailable={lettersAvailable}
          setLettersAvailable={setLettersAvailable}
          wsRef={wsRef}
          board={board}
          gridsPlayed={gridsPlayed}
          setGridsPlayed={setGridsPlayed}
          playersTurn={playersTurn}
          setPlayersTurn={setPlayersTurn}
        />
        <HealthBar />
      </div>
      <LettersAvailable lettersAvailable={lettersAvailable} />
      <CompleteTurn
        playersTurn={playersTurn}
        setPlayersTurn={setPlayersTurn}
        wsRef={wsRef}
        gridsPlayed={gridsPlayed}
      />
    </div>
  );
}

export default App;
