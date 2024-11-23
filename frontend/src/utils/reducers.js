import { generateRandomLetters } from "./utils.js";
import {
  LETTERS_AVAILABLE_ACTIONS,
  CELLS_PLAYED_ACTIONS,
} from "./constants.js";

export function lettersAvailableReducer(state, action) {
  switch (action.type) {
    case LETTERS_AVAILABLE_ACTIONS.GENERATE_LETTERS:
      const newLetters = [...state, ...generateRandomLetters(7 - state.length)];
      return newLetters;
    case LETTERS_AVAILABLE_ACTIONS.REMOVE_LETTER:
      let letterToRemove = action.payload.key.toUpperCase();
      action.payload.target.value = letterToRemove;
      let newLettersAvailable = [];
      let removed = false;

      for (let char of state) {
        if (char === letterToRemove && !removed) {
          removed = true;
        } else {
          newLettersAvailable.push(char);
        }
      }
      return newLettersAvailable;
    case LETTERS_AVAILABLE_ACTIONS.ADD_LETTER:
      const letters = [...state, action.payload];
      return letters;
    default:
      return [];
  }
}

export function cellsPlayedReducer(state, action) {
  switch (action.type) {
    case CELLS_PLAYED_ACTIONS.ADD_CELL:
      return [...state, action.payload];
    case CELLS_PLAYED_ACTIONS.REMOVE_CELL:
      return state.filter((item) => item !== action.payload);
    default:
      return [];
  }
}
