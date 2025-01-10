import React from "react";
import "../../css/Modal.css";

export function LostConnectionModal({ reconnect }) {
  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2>Lost Connection</h2>
        <button
          className="border-2 border-black rounded hover:bg-slate-100"
          onClick={reconnect}
        >
          Reconnect
        </button>
      </div>
    </div>
  );
}
