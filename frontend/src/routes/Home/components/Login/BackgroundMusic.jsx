import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import "./BackgroundMusic.css";

const BackgroundMusic = () => {
  const musicRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

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

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    musicRef.current.mute(newMuteState);
  };

  const changeVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    musicRef.current.volume(newVolume);
  };

  return (
    <div className="m-[20px] flex align-middle justify-between w-full">
      <img
        src={isMuted ? "images/mute.png" : "images/audio_on.png"}
        alt="audio on/off"
        onClick={toggleMute}
        className="object-contain w-10 cursor-pointer"
      />
      <div class="slider-wrapper">
        <span class="volume-label">Volume:</span>
        <div class="slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={changeVolume}
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundMusic;
