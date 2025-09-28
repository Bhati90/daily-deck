import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";

export const PacmanGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grid = 20;
    let count = 0;
    let pacman = { x: grid * 6, y: grid * 6, dx: grid, dy: 0, radius: grid / 2 - 1 };
    let food = { x: grid * 10, y: grid * 10, eaten: false };
    
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pacman.x += pacman.dx;
      pacman.y += pacman.dy;

      if (pacman.x < 0) pacman.x = canvas.width - grid;
      if (pacman.x >= canvas.width) pacman.x = 0;
      if (pacman.y < 0) pacman.y = canvas.height - grid;
      if (pacman.y >= canvas.height) pacman.y = 0;

      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(pacman.x + grid / 2, pacman.y + grid / 2, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(pacman.x + grid / 2, pacman.y + grid / 2);
      ctx.fill();

      if (!food.eaten) {
        ctx.fillStyle = 'white';
        ctx.fillRect(food.x, food.y, grid / 2, grid / 2);
        if (pacman.x === food.x && pacman.y === food.y) {
          food.eaten = true;
          setScore(s => s + 10);
        }
      }

      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') { pacman.dx = 0; pacman.dy = -grid; }
      if (e.key === 'ArrowDown') { pacman.dx = 0; pacman.dy = grid; }
      if (e.key === 'ArrowLeft') { pacman.dx = -grid; pacman.dy = 0; }
      if (e.key === 'ArrowRight') { pacman.dx = grid; pacman.dy = 0; }
    };

    document.addEventListener('keydown', handleKeyDown);
    gameLoop();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-2 text-primary">Pac-Man</h1>
      <div className="mb-4">Score: {score}</div>
      <canvas ref={canvasRef} width="400" height="400" className="bg-black rounded-lg shadow-xl" />
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