import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

type Piece = number[][];
type Board = number[][];

const PIECES: Piece[] = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

const COLORS = ['#00E5FF', '#FFD600', '#9C27B0', '#FF5722', '#4CAF50', '#2196F3', '#FF9800'];

export const TetrisGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);

  const gameRef = useRef({
    board: Array(20).fill(null).map(() => Array(10).fill(0)),
    currentPiece: { shape: PIECES[0], x: 4, y: 0, color: 1 },
    nextPiece: { shape: PIECES[1], color: 2 },
    dropCounter: 0,
    lastTime: 0
  });

  const BLOCK_SIZE = 25;
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  const createPiece = useCallback((): { shape: Piece; color: number } => {
    const pieceIndex = Math.floor(Math.random() * PIECES.length);
    return {
      shape: PIECES[pieceIndex],
      color: pieceIndex + 1
    };
  }, []);

  const rotatePiece = (piece: Piece): Piece => {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    return rotated;
  };

  const isValidMove = useCallback((board: Board, piece: Piece, x: number, y: number): boolean => {
    for (let py = 0; py < piece.length; py++) {
      for (let px = 0; px < piece[py].length; px++) {
        if (piece[py][px] !== 0) {
          const newX = x + px;
          const newY = y + py;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback(() => {
    const game = gameRef.current;
    const { currentPiece, board } = game;
    
    // Place the piece on the board
    for (let py = 0; py < currentPiece.shape.length; py++) {
      for (let px = 0; px < currentPiece.shape[py].length; px++) {
        if (currentPiece.shape[py][px] !== 0) {
          const y = currentPiece.y + py;
          const x = currentPiece.x + px;
          if (y >= 0) {
            board[y][x] = currentPiece.color;
          }
        }
      }
    }

    // Check for completed lines
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== 0)) {
        board.splice(y, 1);
        board.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same line again
      }
    }

    if (linesCleared > 0) {
      setLines(prev => {
        const newLines = prev + linesCleared;
        setLevel(Math.floor(newLines / 10) + 1);
        return newLines;
      });
      
      const points = [0, 40, 100, 300, 1200][linesCleared] * level;
      setScore(prev => prev + points);
    }

    // Spawn new piece
    const newPiece = game.nextPiece;
    game.currentPiece = { ...newPiece, x: 4, y: 0 };
    game.nextPiece = createPiece();

    // Check game over
    if (!isValidMove(board, game.currentPiece.shape, game.currentPiece.x, game.currentPiece.y)) {
      setGameState('gameOver');
    }
  }, [level, isValidMove, createPiece]);

  const movePiece = useCallback((dx: number, dy: number) => {
    const game = gameRef.current;
    const newX = game.currentPiece.x + dx;
    const newY = game.currentPiece.y + dy;
    
    if (isValidMove(game.board, game.currentPiece.shape, newX, newY)) {
      game.currentPiece.x = newX;
      game.currentPiece.y = newY;
      return true;
    }
    return false;
  }, [isValidMove]);

  const rotatePieceGame = useCallback(() => {
    const game = gameRef.current;
    const rotated = rotatePiece(game.currentPiece.shape);
    
    if (isValidMove(game.board, rotated, game.currentPiece.x, game.currentPiece.y)) {
      game.currentPiece.shape = rotated;
    }
  }, [isValidMove]);

  const dropPiece = useCallback(() => {
    if (!movePiece(0, 1)) {
      placePiece();
    }
  }, [movePiece, placePiece]);

  const hardDrop = useCallback(() => {
    while (movePiece(0, 1)) {
      setScore(prev => prev + 2);
    }
    placePiece();
  }, [movePiece, placePiece]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const game = gameRef.current;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (game.board[y][x] !== 0) {
          ctx.fillStyle = COLORS[game.board[y][x] - 1];
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      }
    }

    // Draw current piece
    const { currentPiece } = game;
    ctx.fillStyle = COLORS[currentPiece.color - 1];
    for (let py = 0; py < currentPiece.shape.length; py++) {
      for (let px = 0; px < currentPiece.shape[py].length; px++) {
        if (currentPiece.shape[py][px] !== 0) {
          const x = (currentPiece.x + px) * BLOCK_SIZE;
          const y = (currentPiece.y + py) * BLOCK_SIZE;
          ctx.fillRect(x, y, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      }
    }

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;

    const game = gameRef.current;
    const deltaTime = time - game.lastTime;
    game.lastTime = time;

    game.dropCounter += deltaTime;
    
    const dropTime = 1000 - (level - 1) * 50; // Increase speed with level
    
    if (game.dropCounter > dropTime) {
      dropPiece();
      game.dropCounter = 0;
    }

    drawGame();
    requestAnimationFrame(gameLoop);
  }, [gameState, level, dropPiece, drawGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestAnimationFrame(gameLoop);
    }
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          dropPiece();
          setScore(prev => prev + 1);
          break;
        case 'ArrowUp':
          rotatePieceGame();
          break;
        case ' ':
          hardDrop();
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, movePiece, dropPiece, rotatePieceGame, hardDrop]);

  const resetGame = useCallback(() => {
    gameRef.current = {
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: { shape: PIECES[0], x: 4, y: 0, color: 1 },
      nextPiece: createPiece(),
      dropCounter: 0,
      lastTime: 0
    };
    setScore(0);
    setLines(0);
    setLevel(1);
  }, [createPiece]);

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 text-primary">Tetris</h1>
        <div className="flex justify-center space-x-8 text-lg">
          <span>Score: {score}</span>
          <span>Lines: {lines}</span>
          <span>Level: {level}</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="relative bg-gray-800 rounded-lg p-4 shadow-xl">
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH * BLOCK_SIZE}
            height={BOARD_HEIGHT * BLOCK_SIZE}
            className="border-2 border-gray-600 rounded-lg"
          />

          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Tetris</h2>
                <p className="mb-4">Clear lines by filling rows completely</p>
                <Button onClick={startGame} className="gaming-button">
                  Start Game
                </Button>
              </div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 text-red-400">Game Over!</h2>
                <p className="mb-2">Final Score: {score}</p>
                <p className="mb-4">Lines Cleared: {lines}</p>
                <div className="space-x-4">
                  <Button onClick={startGame} className="gaming-button">
                    Play Again
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Piece Preview */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-center">Next</h3>
          <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
            {/* Next piece preview would go here */}
            <div className="text-gray-400 text-xs">Next piece</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>← → Move • ↓ Soft Drop • ↑ Rotate • Space Hard Drop</p>
      </div>
    </div>
  );
};