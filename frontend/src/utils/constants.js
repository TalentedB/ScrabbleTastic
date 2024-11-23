// Reducer functions
export const LETTERS_AVAILABLE_ACTIONS = {
  GENERATE_LETTERS: "generateLetters",
  REMOVE_LETTER: "removeLetter",
  ADD_LETTER: "addLetter",
};

export const CELLS_PLAYED_ACTIONS = {
  ADD_CELL: "addCell",
  REMOVE_CELL: "removeCell",
};

// Create the letter Distribution
const DISTRIBUTIONS = {
  E: 12,
  A: 9,
  I: 9,
  O: 8,
  N: 6,
  R: 6,
  T: 6,
  L: 4,
  S: 4,
  U: 4,
  D: 4,
  G: 3,
  B: 2,
  C: 2,
  M: 2,
  P: 2,
  F: 2,
  H: 2,
  V: 2,
  W: 2,
  Y: 2,
  K: 1,
  J: 1,
  X: 1,
  Q: 1,
  Z: 1,
};

let letters = "";

for (const key in DISTRIBUTIONS) {
  letters += key.repeat(DISTRIBUTIONS[key]);
}

export const LETTERS = letters;
//
