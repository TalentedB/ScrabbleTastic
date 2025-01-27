import { WebSocketServer } from "ws";
import {
  isEveryValueTrue,
  printConnectionStatus,
  printGrid,
  calcPoints,
  generateRandomLetters,
} from "../utils/utils.js";
import fs from "fs";

function Client() {
  this.conn = null;
  this.points = 0;
  this.playHistory = [];
  this.lettersAvailable = null;
}

let wordSet = new Set();

fs.readFile("assets/wordlist.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse the JSON data
  const wordList = JSON.parse(data);
  wordSet = new Set(wordList);
});

const PORT = 8080;

let masterBoard = Array.from({ length: 15 }, () => Array(15).fill(""));

const wss = new WebSocketServer({ port: PORT });
// const clients = { 0: null, 1: null };
const clients = { 0: new Client(), 1: new Client() };
clients[0].lettersAvailable = generateRandomLetters(7);
clients[1].lettersAvailable = generateRandomLetters(7);

let currTurn = 0;

let inGame = false;

wss.on("connection", function connection(ws) {
  if (clients[0].conn === null) {
    clients[0].conn = ws;
    inGame = false;
    console.log("Client 0 has Connected");
    printConnectionStatus(clients);
  } else if (clients[1].conn === null) {
    clients[1].conn = ws;
    inGame = false;
    console.log("Client 1 has Connected");
    printConnectionStatus(clients);
  }

  if (clients[0].conn !== null && clients[1].conn !== null && !inGame) {
    inGame = true;
    console.log(`Game Started or reconnected. It is Client ${currTurn} turn`);

    if (currTurn === 0) {
      clients[currTurn].conn.send(
        JSON.stringify({
          turn: 1,
          board: masterBoard,
          playersPoints: clients[0].points,
          opponentPoints: clients[1].points,
          playHistory: clients[0].playHistory,
          opponentHistory: clients[1].playHistory,
          lettersAvailable: clients[0].lettersAvailable,
        }),
      );
      clients[1].conn.send(
        JSON.stringify({
          turn: 0,
          board: masterBoard,
          playersPoints: clients[1].points,
          opponentPoints: clients[0].points,
          playHistory: clients[1].playHistory,
          opponentHistory: clients[0].playHistory,
          lettersAvailable: clients[1].lettersAvailable,
        }),
      );
    } else {
      clients[currTurn].conn.send(
        JSON.stringify({
          turn: 1,
          board: masterBoard,
          playersPoints: clients[1].points,
          opponentPoints: clients[0].points,
          playHistory: clients[1].playHistory,
          opponentHistory: clients[0].playHistory,
          lettersAvailable: clients[1].lettersAvailable,
        }),
      );
      clients[0].conn.send(
        JSON.stringify({
          turn: 0,
          board: masterBoard,
          playersPoints: clients[0].points,
          opponentPoints: clients[1].points,
          playHistory: clients[0].playHistory,
          opponentHistory: clients[1].playHistory,
          lettersAvailable: clients[0].lettersAvailable,
        }),
      );
    }
  } else if (inGame) {
    console.log("game ongoing, can't connect");
  }

  ws.on("message", function message(data) {
    console.log("received: %s", data);

    const { board, words, lettersPlayed, debugMode } = JSON.parse(data);
    let validity = {};
    for (const word of words) {
      const valid = wordSet.has(word.toLowerCase());
      validity[word] = valid;
    }

    if (isEveryValueTrue(validity)) {
      // Add to play history and add points
      clients[currTurn].playHistory.push(words);
      clients[currTurn].points += calcPoints(words);

      let playedIllegalMove = false;

      if (!debugMode) {
        for (let letter of lettersPlayed) {
          let index = clients[currTurn].lettersAvailable.indexOf(letter);

          if (index !== -1) {
            clients[currTurn].lettersAvailable.splice(index, 1);
          } else {
            playedIllegalMove = true;
            break;
          }
        }
      }

      if (playedIllegalMove) {
        ws.send(JSON.stringify({ validity: validity }));
        console.log(
          "Illegal Move (Don't have the Characters, if you are testing make sure to turn on Debug Mode)",
        );
      } else {
        console.log(clients);
        const let_available = clients[currTurn].lettersAvailable;
        if (!debugMode) {
          clients[currTurn].lettersAvailable = [
            ...let_available,
            ...generateRandomLetters(7 - let_available.length),
          ];
        }

        masterBoard = board;
        printGrid(masterBoard);
        clients[currTurn].conn.send(
          JSON.stringify({
            turn: 0,
            board: masterBoard,
            playersPoints: clients[currTurn].points,
            opponentPoints: clients[currTurn ? 0 : 1].points,
            playHistory: clients[currTurn].playHistory,
            opponentHistory: clients[currTurn ? 0 : 1].playHistory,
            lettersAvailable: clients[currTurn].lettersAvailable,
          }),
        );
        currTurn = currTurn ? 0 : 1; // if currTurn is 1 then turn it 0 else 1
        clients[currTurn].conn.send(
          JSON.stringify({
            turn: 1,
            board: masterBoard,
            playersPoints: clients[currTurn].points,
            opponentPoints: clients[currTurn ? 0 : 1].points,
            playHistory: clients[currTurn].playHistory,
            opponentHistory: clients[currTurn ? 0 : 1].playHistory,
            lettersAvailable: clients[currTurn].lettersAvailable,
          }),
        );
      }
    } else {
      ws.send(JSON.stringify({ validity: validity }));
      console.log("Invalid Play");
    }
  });

  ws.on("close", () => {
    if (clients[0].conn === ws) {
      clients[0].conn = null;
      console.log("Client 0 has Disconnected");
    } else {
      clients[1].conn = null;
      console.log("Client 1 has Disconnected");
    }

    printConnectionStatus(clients);

    if (!clients[0].conn && !clients[1].conn) {
      clients[0] = new Client();
      clients[1] = new Client();
      clients[0].lettersAvailable = generateRandomLetters(7);
      clients[1].lettersAvailable = generateRandomLetters(7);
      currTurn = 0;
      inGame = false;
      masterBoard = Array.from({ length: 15 }, () => Array(15).fill(""));
      console.log("Both Clients Disconnected, restarting game");
    }
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
