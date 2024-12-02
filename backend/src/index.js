import { WebSocketServer } from "ws";
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

const emptyBoard = Array.from({ length: 15 }, () => Array(15).fill(""));

const wss = new WebSocketServer({ port: PORT });
const clients = new Set();

const isEveryValueTrue = (obj) =>
  Object.values(obj).every((value) => value === true);

wss.on("connection", function connection(ws) {
  // const points = {[]};

  clients.add(ws);
  console.log("Clients Connected:", clients.size);

  if (clients.size >= 2) {
    console.log("2 Clients Connected");
    for (let i = 0; i < clients.length; i++) {
      if (i === 0) {
        clients[i].send(JSON.stringify({ turn: 1, board: emptyBoard }));
      } else {
        clients[i].send(JSON.stringify({ turn: 0 }));
      }
    }
  }

  ws.on("message", function message(data) {
    console.log("received: %s", data);
    // printData(data.board);

    const { board, words } = JSON.parse(data);
    let validity = {};
    for (const word of words) {
      const valid = wordSet.has(word.toLowerCase());
      validity[word] = valid;
    }

    if (isEveryValueTrue(validity)) {
      clients.forEach((client) => {
        if (client === ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ turn: 0 }));
        } else if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ turn: 1, board: board }));
        }
      });
    } else {
      ws.send(JSON.stringify({ validity: validity }));
    }
  });
  ws.on("close", () => {
    clients.delete(ws);
    console.log("Clients Connected:", clients.size);
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
