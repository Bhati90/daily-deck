import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

export const DinoRun = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dino = { x: 50, y: 150, width: 20, height: 20, dy: 0, gravity: 0.6, jump: -10, ground: 150 };
    let obstacles: { x: number; y: number; width: number; height: number }[] = [];
    let gameSpeed = 3;
    let score = 0;
    let animationFrameId: number;

    const jump = () => {
      if (dino.y === dino.ground) {
        dino.dy = dino.jump;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', jump);

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dino.dy += dino.gravity;
      dino.y += dino.dy;
      if (dino.y > dino.ground) {
        dino.y = dino.ground;
        dino.dy = 0;
      }

      ctx.fillStyle = 'green';
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

      if (Math.random() < 0.02) {
        obstacles.push({ x: canvas.width, y: 160, width: 10, height: 10 });
      }

      obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (
          dino.x < obstacle.x + obstacle.width &&
          dino.x + dino.width > obstacle.x &&
          dino.y < obstacle.y + obstacle.height &&
          dino.y + dino.height > obstacle.y
        ) {
          setGameOver(true);
          setIsPlaying(false);
          cancelAnimationFrame(animationFrameId);
        }

        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(index, 1);
          score++;
          setScore(score);
        }
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', jump);
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
      <h1 className="text-4xl font-bold mb-2 text-primary">Dino Run</h1>
      <div className="mb-4">Score: {score}</div>
      <canvas ref={canvasRef} width="600" height="200" className="bg-gray-800 rounded-lg shadow-xl" />
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