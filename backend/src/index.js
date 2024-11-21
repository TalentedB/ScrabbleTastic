let wordSet = new Set();

import fs from "fs";
fs.readFile("assets/wordlist.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse the JSON data
  const wordList = JSON.parse(data);
  wordSet = new Set(wordList);
});

import { WebSocketServer } from "ws";

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });
const clients = new Set();

const isEveryValueTrue = (obj) =>
  Object.values(obj).every((value) => value === true);

wss.on("connection", function connection(ws) {
  clients.add(ws);

  ws.on("message", function message(data) {
    console.log("received: %s", data);

    const { board, words } = JSON.parse(data);
    let validity = {};
    for (const word of words) {
      const valid = wordSet.has(word.toLowerCase());
      validity[word] = valid;
    }

    console.log(isEveryValueTrue(validity));
    if (isEveryValueTrue(validity)) {
      clients.forEach((client) => {
        if (client === ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ turn: 0 }));
        } else if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ turn: 1, board: board }));
        }
      });
    } else {
      ws.send(JSON.stringify(validity));
    }
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
