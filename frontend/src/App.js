import "./css/App.css";
import { CompleteTurn } from "./components/Turn.jsx";
import { Grid } from "./components/Grid.jsx";
import { HealthBar } from "./components/HealthBar.jsx";
import { LettersAvailable } from "./components/LettersAvailable.jsx";
import { useEffect, useState, useRef } from "react";
import { generateRandomLetters, updateBoard } from "./utils/utils.js";

function App() {
  const [board, setBoard] = useState([
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  ]);
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
        setBoard(data.board);
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
        />
        <HealthBar />
      </div>
      <LettersAvailable lettersAvailable={lettersAvailable} />
      <CompleteTurn curState="waiting" />
    </div>
  );
}

export default App;
