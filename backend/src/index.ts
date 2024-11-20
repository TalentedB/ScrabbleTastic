const PORT = 8080;

const express = require("express");
const app = express();

app.use(express.json());

let wordSet = new Set();

const fs = require("fs");
fs.readFile("assets/wordlist.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse the JSON data
  const wordList = JSON.parse(data);
  wordSet = new Set(wordList);
});

app.get("/health-check", (req, res) => {
  const status = {
    status: "healthy",
    timestamp: Date.now().toString(),
  };
  res.send(status);
});

app.post("/check-words", (req, res) => {
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
