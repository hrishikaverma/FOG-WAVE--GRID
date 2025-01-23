import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Sound effect imports
import clickSound from "./assets/click.mp3";
import waveSound from "./assets/wave.mp3";
import buttonSound from "./assets/button.mp3";

const App = () => {
  const rows = 15;
  const cols = 20;

  const [grid, setGrid] = useState(Array(rows).fill(Array(cols).fill(false)));
  const [colors] = useState(["#39ff14", "#00ffff", "#ff073a", "#ffea00"]);
  const [currentColor, setCurrentColor] = useState(0);
  const [waveSpeed, setWaveSpeed] = useState(100);
  const [isWaveActive, setIsWaveActive] = useState(true);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  // Sound effect refs
  const cellClickSound = useRef(null);
  const waveEffectSound = useRef(null);
  const buttonClickSound = useRef(null);

  // Initialize sounds on first user interaction
  const initializeSounds = () => {
    if (!isAudioInitialized) {
      cellClickSound.current = new Audio(clickSound);
      waveEffectSound.current = new Audio(waveSound);
      buttonClickSound.current = new Audio(buttonSound);
      setIsAudioInitialized(true);
    }
  };

  // Change colors every second
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setCurrentColor((prevColor) => (prevColor + 1) % colors.length);
    }, 1000);

    return () => clearInterval(colorInterval);
  }, [colors]);

  // Create the wave effect
  const createWave = () => {
    const newGrid = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) =>
        Math.sin(i + j + Date.now() / 500) > 0.5
      )
    );
    setGrid(newGrid);

    if (isAudioInitialized) {
      waveEffectSound.current.volume = 0.1;
      waveEffectSound.current.play();
    }
  };

  // Wave animation
  useEffect(() => {
    if (isWaveActive) {
      const waveInterval = setInterval(createWave, waveSpeed);
      return () => clearInterval(waveInterval);
    }
  }, [waveSpeed, isWaveActive]);

  // Handle grid cell toggle
  const handleGridClick = (rowIndex, colIndex) => {
    initializeSounds(); // Ensure sounds are initialized
    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? !cell : cell))
    );
    setGrid(newGrid);

    if (isAudioInitialized) cellClickSound.current.play();
  };

  // Adjust wave speed
  const handleSpeedChange = (speed) => {
    initializeSounds(); // Ensure sounds are initialized
    setWaveSpeed(speed);

    if (isAudioInitialized) buttonClickSound.current.play();
  };

  // Toggle wave animation
  const toggleWaveEffect = () => {
    initializeSounds(); // Ensure sounds are initialized
    setIsWaveActive((prev) => !prev);

    if (isAudioInitialized) buttonClickSound.current.play();
  };

  // Reset grid
  const resetGrid = () => {
    initializeSounds(); // Ensure sounds are initialized
    setGrid(Array(rows).fill(Array(cols).fill(false)));

    if (isAudioInitialized) buttonClickSound.current.play();
  };

  return (
    <div className="container" onClick={initializeSounds}>
      <h1 className="title">Interactive Neon Wave Grid</h1>

      {/* Controls */}
      <div className="controls">
        <button onClick={() => handleSpeedChange(50)}>Speed Up</button>
        <button onClick={() => handleSpeedChange(200)}>Slow Down</button>
        <button onClick={toggleWaveEffect}>
          {isWaveActive ? "Stop Wave" : "Start Wave"}
        </button>
        <button onClick={resetGrid}>Reset Grid</button>
      </div>

      {/* Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((isActive, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`grid-item ${isActive ? "active" : ""}`}
              style={{
                backgroundColor: isActive ? colors[currentColor] : "black",
                boxShadow: isActive
                  ? `0 0 10px ${colors[currentColor]}, 0 0 20px ${colors[currentColor]}`
                  : "none",
              }}
              onClick={() => handleGridClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
