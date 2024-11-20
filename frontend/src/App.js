import "./App.css";
import { Grid } from "./Grid.jsx";

function App() {
  return (
    <div className="App">
      <h1 className="text-xl">Realtime Scrabble</h1>
      <div className="flex justify-around items-center">
        <HealthBar />
        <Grid />
        <HealthBar />
      </div>
    </div>
  );
}

const HealthBar = () => {
  return <progress id="file" value="100" max="100"></progress>;
};

export default App;
