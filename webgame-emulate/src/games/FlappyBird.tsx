import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

export const FlappyBird = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bird = { x: 50, y: 150, radius: 10, velocity: 0, gravity: 0.3, lift: -6 };
    let pipes: { x: number; y: number; width: number; height: number; passed: boolean }[] = [];
    let pipeWidth = 20;
    let pipeGap = 100;
    let pipeInterval = 90;
    let frameCount = 0;
    let score = 0;
    let animationFrameId: number;

    const jump = () => {
      bird.velocity = bird.lift;
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

      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y > canvas.height - bird.radius || bird.y < bird.radius) {
        setGameOver(true);
        setIsPlaying(false);
        cancelAnimationFrame(animationFrameId);
        return;
      }

      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'yellow';
      ctx.fill();

      if (frameCount % pipeInterval === 0) {
        const pipeY = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: pipeY, passed: false });
        pipes.push({ x: canvas.width, y: pipeY + pipeGap, width: pipeWidth, height: canvas.height - pipeY - pipeGap, passed: false });
      }

      pipes.forEach((pipe, index) => {
        pipe.x -= 2;
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

        if (
          bird.x + bird.radius > pipe.x &&
          bird.x - bird.radius < pipe.x + pipe.width &&
          bird.y + bird.radius > pipe.y &&
          bird.y - bird.radius < pipe.y + pipe.height
        ) {
          setGameOver(true);
          setIsPlaying(false);
          cancelAnimationFrame(animationFrameId);
        }

        if (!pipe.passed && pipe.x < bird.x) {
          pipe.passed = true;
          score += 0.5; // Each pipe pair is one point
          setScore(Math.floor(score));
        }

        if (pipe.x + pipe.width < 0) {
          pipes.splice(index, 1);
        }
      });

      frameCount++;
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
      <h1 className="text-4xl font-bold mb-2 text-primary">Flappy Bird</h1>
      <div className="mb-4">Score: {score}</div>
      <canvas ref={canvasRef} width="320" height="480" className="bg-blue-400 rounded-lg shadow-xl" />
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