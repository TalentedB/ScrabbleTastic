import { WebSocketServer } from "ws";
import { isEveryValueTrue, printConnectionStatus, printGrid } from "./utils.js";
import fs from "fs";

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
const clients = { 0: null, 1: null };
let currTurn = 0;

let inGame = false;

wss.on("connection", function connection(ws) {
  if (clients[0] === null) {
    clients[0] = ws;
    inGame = false;
    console.log("Client 0 has Connected");
    printConnectionStatus(clients);
  } else if (clients[1] === null) {
    clients[1] = ws;
    inGame = false;
    console.log("Client 1 has Connected");
    printConnectionStatus(clients);
  }

  if (clients[0] !== null && clients[1] !== null && !inGame) {
    inGame = true;
    console.log(`Game Started or reconnected. It is Client ${currTurn} turn`);

    if (currTurn === 0) {
      clients[currTurn].send(JSON.stringify({ turn: 1, board: masterBoard }));
      clients[1].send(JSON.stringify({ turn: 0, board: masterBoard }));
    } else {
      clients[currTurn].send(JSON.stringify({ turn: 1, board: masterBoard }));
      clients[0].send(JSON.stringify({ turn: 0, board: masterBoard }));
    }
  } else if (inGame) {
    console.log("game ongoing, can't connect");
  }

  ws.on("message", function message(data) {
    console.log("received: %s", data);

    const { board, words } = JSON.parse(data);
    let validity = {};
    for (const word of words) {
      const valid = wordSet.has(word.toLowerCase());
      validity[word] = valid;
    }

    if (isEveryValueTrue(validity)) {
      masterBoard = board;
      printGrid(masterBoard);
      clients[currTurn].send(JSON.stringify({ turn: 0, board: masterBoard }));
      currTurn = currTurn ? 0 : 1; // if currTurn is 1 then turn it 0 else 1
      clients[currTurn].send(JSON.stringify({ turn: 1, board: masterBoard }));
    } else {
      ws.send(JSON.stringify({ validity: validity }));
      console.log("Invalid Play");
    }
  });

  ws.on("close", () => {
    if (clients[0] === ws) {
      clients[0] = null;
      console.log("Client 0 has Disconnected");
    } else {
      clients[1] = null;
      console.log("Client 1 has Disconnected");
    }

    printConnectionStatus(clients);

    if (!clients[0] && !clients[1]) {
      currTurn = 0;
      inGame = false;
      masterBoard = Array.from({ length: 15 }, () => Array(15).fill(""));
      console.log("Both Clients Disconnected, restarting game");
    }
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
