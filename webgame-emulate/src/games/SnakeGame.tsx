import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

export const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => 
    parseInt(localStorage.getItem('snakeHighScore') || '0')
  );

  const gameRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 }
  });

  const GRID_SIZE = 20;
  const CANVAS_SIZE = 400;

  const generateFood = useCallback((): Position => {
    const max = Math.floor(CANVAS_SIZE / GRID_SIZE);
    return {
      x: Math.floor(Math.random() * max),
      y: Math.floor(Math.random() * max)
    };
  }, []);

  const resetGame = useCallback(() => {
    gameRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: generateFood(),
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 }
    };
    setScore(0);
  }, [generateFood]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = '#00E5FF';
    gameRef.current.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#FF6B35';
      } else {
        ctx.fillStyle = '#00E5FF';
      }
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#FF1744';
    ctx.beginPath();
    ctx.arc(
      gameRef.current.food.x * GRID_SIZE + GRID_SIZE / 2,
      gameRef.current.food.y * GRID_SIZE + GRID_SIZE / 2,
      (GRID_SIZE - 2) / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const game = gameRef.current;
    
    // Update direction
    game.direction = { ...game.nextDirection };

    // Move snake
    const head = { ...game.snake[0] };
    head.x += game.direction.x;
    head.y += game.direction.y;

    // Check wall collision
    const maxGrid = Math.floor(CANVAS_SIZE / GRID_SIZE);
    if (head.x < 0 || head.x >= maxGrid || head.y < 0 || head.y >= maxGrid) {
      setGameState('gameOver');
      return;
    }

    // Check self collision
    if (game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameState('gameOver');
      return;
    }

    game.snake.unshift(head);

    // Check food collision
    if (head.x === game.food.x && head.y === game.food.y) {
      setScore(prev => {
        const newScore = prev + 10;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        return newScore;
      });
      game.food = generateFood();
    } else {
      game.snake.pop();
    }

    drawGame();
  }, [gameState, drawGame, generateFood, highScore]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(gameLoop, 150);
      return () => clearInterval(interval);
    }
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const game = gameRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (game.direction.y === 0) game.nextDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (game.direction.y === 0) game.nextDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (game.direction.x === 0) game.nextDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (game.direction.x === 0) game.nextDirection = { x: 1, y: 0 };
          break;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const startGame = () => {
    resetGame();
    setGameState('playing');
    gameRef.current.nextDirection = { x: 1, y: 0 };
  };

  const pauseGame = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 text-primary">Snake Game</h1>
        <div className="flex justify-center space-x-8 text-lg">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
        </div>
      </div>

      <div className="relative bg-gray-800 rounded-lg p-4 shadow-xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-2 border-gray-600 rounded-lg"
        />

        {/* Game State Overlays */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Snake Game</h2>
              <p className="mb-4">Use arrow keys to control the snake</p>
              <Button onClick={startGame} className="gaming-button">
                Start Game
              </Button>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Paused</h2>
              <Button onClick={pauseGame} className="gaming-button">
                Resume
              </Button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-red-400">Game Over!</h2>
              <p className="mb-2">Final Score: {score}</p>
              {score === highScore && score > 0 && (
                <p className="mb-4 text-yellow-400">New High Score! 🎉</p>
              )}
              <div className="space-x-4">
                <Button onClick={startGame} className="gaming-button">
                  Play Again
                </Button>
                <Button onClick={() => setGameState('menu')} variant="outline">
                  Menu
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 space-x-4">
        {gameState === 'playing' && (
          <Button onClick={pauseGame} variant="outline">
            Pause
          </Button>
        )}
        
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Use ← → ↑ ↓ arrow keys to move</p>
        </div>
      </div>
    </div>
  );
};