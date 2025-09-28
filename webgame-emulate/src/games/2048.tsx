import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

type Tile = number;
type Board = Tile[][];

const GRID_SIZE = 4;

export const Game2048 = () => {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const addNewTile = (board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    const emptyTiles: { x: number; y: number }[] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newBoard[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      newBoard[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
    return newBoard;
  };

  const startGame = useCallback(() => {
    let newBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    newBoard = addNewTile(newBoard);
    newBoard = addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const slide = (row: Tile[]): Tile[] => {
    let arr = row.filter(val => val);
    let missing = GRID_SIZE - arr.length;
    let zeros = Array(missing).fill(0);
    arr = arr.concat(zeros);
    return arr;
  };

  const combine = (row: Tile[]): { newRow: Tile[]; scoreToAdd: number } => {
    let scoreToAdd = 0;
    for (let i = 0; i < GRID_SIZE - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        scoreToAdd += row[i];
        row[i + 1] = 0;
      }
    }
    return { newRow: row, scoreToAdd };
  };

  const operate = (row: Tile[]): { newRow: Tile[]; scoreToAdd: number } => {
    let newRow = slide(row);
    const result = combine(newRow);
    newRow = result.newRow;
    newRow = slide(newRow);
    return { newRow, scoreToAdd: result.scoreToAdd };
  };

  const rotateLeft = (board: Board): Board => {
    const newBoard: Board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newBoard[i][j] = board[j][GRID_SIZE - 1 - i];
      }
    }
    return newBoard;
  };

  const rotateRight = (board: Board): Board => {
    const newBoard: Board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newBoard[i][j] = board[GRID_SIZE - 1 - j][i];
      }
    }
    return newBoard;
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let tempBoard = board.map(row => [...row]);
    let totalScoreToAdd = 0;

    const transformations = {
      left: (b: Board) => b,
      right: (b: Board) => b.map(row => row.reverse()),
      up: rotateLeft,
      down: rotateRight,
    };

    const reverseTransformations = {
      left: (b: Board) => b,
      right: (b: Board) => b.map(row => row.reverse()),
      up: rotateRight,
      down: rotateLeft,
    };

    tempBoard = transformations[direction](tempBoard);

    for (let i = 0; i < GRID_SIZE; i++) {
      const { newRow, scoreToAdd } = operate(tempBoard[i]);
      totalScoreToAdd += scoreToAdd;
      tempBoard[i] = newRow;
    }

    tempBoard = reverseTransformations[direction](tempBoard);

    if (JSON.stringify(tempBoard) !== JSON.stringify(board)) {
      tempBoard = addNewTile(tempBoard);
      setBoard(tempBoard);
      setScore(prev => prev + totalScoreToAdd);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  }, [move]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const getTileColor = (value: number) => {
    switch (value) {
      case 2: return 'bg-gray-200 text-gray-800';
      case 4: return 'bg-gray-300 text-gray-800';
      case 8: return 'bg-orange-300 text-white';
      case 16: return 'bg-orange-400 text-white';
      case 32: return 'bg-orange-500 text-white';
      case 64: return 'bg-orange-600 text-white';
      case 128: return 'bg-yellow-400 text-white';
      case 256: return 'bg-yellow-500 text-white';
      case 512: return 'bg-yellow-600 text-white';
      case 1024: return 'bg-green-400 text-white';
      case 2048: return 'bg-green-500 text-white';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white ">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 text-primary">2048</h1>
        <div className="flex justify-center space-x-8 text-lg">
          <span>Score: {score}</span>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
        <div className="grid grid-cols-4 gap-2">
          {board.map((row, i) =>
            row.map((tile, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-20 h-20 flex items-center justify-center text-3xl font-bold rounded-lg ${getTileColor(tile)}`}
              >
                {tile > 0 ? tile : ''}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-6">
        <Button onClick={startGame} className="gaming-button">
          New Game
        </Button>
      </div>
    </div>
  );
};

export default Game2048;