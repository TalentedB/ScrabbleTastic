import React from "react";
import "../../css/Modal.css";

export function InvalidMoveModal({ setFalse, words }) {
  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2>You Played Invalid Words</h2>
        <ul>
          {words.map((word) => (
            <li>{word}</li>
          ))}
        </ul>
        <button
          className="border-2 border-black rounded hover:bg-slate-100"
          onClick={setFalse}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
