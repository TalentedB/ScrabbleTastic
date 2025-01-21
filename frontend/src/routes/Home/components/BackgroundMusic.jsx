import { useEffect, useRef } from "react";
import { Howl } from "howler";

const BackgroundMusic = () => {
  const musicRef = useRef(null);

  useEffect(() => {
    musicRef.current = new Howl({
      src: ["sounds/intro.mp3"],
      loop: true,
      volume: 0.5,
    });

    musicRef.current.play();

    return () => {
      musicRef.current.stop();
    };
  }, []);

  return null;
};

export default BackgroundMusic;
