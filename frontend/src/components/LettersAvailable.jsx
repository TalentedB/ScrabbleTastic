import { useContext, useState, useRef, useEffect } from "react";
import "../css/LettersAvailable.css";
import { GameContext } from "../contexts/gameContext";

const Draggable = ({ initialPos = { x: 0, y: 0 }, children }) => {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState(null); // Position relative to cursor
  const ref = useRef(null); // Reference to the draggable element

  // Attach and clean up event listeners for mousemove and mouseup
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPos({
        x: e.pageX - rel.x,
        y: e.pageY - rel.y,
      });
      e.stopPropagation();
      e.preventDefault();
    };

    const handleMouseUp = (e) => {
      setDragging(false);
      e.stopPropagation();
      e.preventDefault();
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, rel]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    e.target.style.position = "absolute";
    const rect = ref.current.getBoundingClientRect();
    setDragging(true);
    setRel({
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      style={{
        // position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        cursor: "grab",
      }}
    >
      {children}
    </div>
  );
};

export const LettersAvailable = () => {
  const { lettersAvailableState } = useContext(GameContext);
  return (
    <div className="flex justify-around w-1/2 content-center mx-auto mt-5 bg-amber-900 p-1 h-10 holder">
      {lettersAvailableState.map((letter) => (
        <Draggable initialPos={{ x: 10, y: 10 }}>
          <div className="border bg-amber-200 border-black w-8 h-8 text-center text-base piece">
            {letter}
          </div>
        </Draggable>
      ))}
    </div>
  );
};
