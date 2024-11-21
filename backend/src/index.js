const PORT = 8080;

import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

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

app.get("/", (req, res) => {
  res.send("server up and running");
});

app.get("/health-check", (req, res) => {
  const status = {
    status: "healthy",
    timestamp: Date.now().toString(),
  };
  res.send(status);
});

app.post("/check-words", (req, res) => {
  console.log("received post");
  const { words } = req.body;
  let validity = {};
  for (const word of words) {
    const valid = wordSet.has(word);
    validity[word] = valid;
  }

  res.send(validity);
});

const http_server = app.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});
