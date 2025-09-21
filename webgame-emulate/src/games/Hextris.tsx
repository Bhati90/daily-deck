import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

export const Hextris = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // A simplified Hextris logic will be implemented here
    // This is a placeholder for a more complex game logic
    // For a full implementation, you'd need a more extensive game engine

    const drawHexagon = (x: number, y: number, size: number, color: string) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + size * Math.cos(i * Math.PI / 3), y + size * Math.sin(i * Math.PI / 3));
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    let rotation = 0;
    let animationFrameId: number;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      drawHexagon(0, 0, 50, 'blue');
      ctx.restore();

      rotation += 0.01;

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-2 text-primary">Hextris</h1>
      <div className="mb-4">Score: {score}</div>
      <canvas ref={canvasRef} width="400" height="400" className="bg-gray-800 rounded-lg shadow-xl" />
      {!isPlaying && (
        <div className="mt-4">
          <Button onClick={startGame} className="gaming-button">
            {gameOver ? 'Play Again' : 'Start Game'}
          </Button>
        </div>
      )}
    </div>
  );
};