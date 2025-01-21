import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import "./BackgroundMusic.css";

const BackgroundMusic = () => {
  const musicRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  console.log(isMuted);

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
    console.log("toggling mute");
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
    <div className="m-[20px] flex-col relative">
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
      <img
        src={isMuted ? "images/mute.png" : "images/audio_on.png"}
        alt="audio on/off"
        onClick={toggleMute}
        className="object-contain w-10 cursor-pointer"
      />
    </div>
  );
};

export default BackgroundMusic;
