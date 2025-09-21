import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export const Minesweeper = () => {
  const [board, setBoard] = useState<any[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const createBoard = () => {
    let newBoard = Array(10).fill(null).map(() => Array(10).fill({ value: 0, revealed: false, flagged: false }));
    let mines = 10;
    while (mines > 0) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      if (newBoard[row][col].value !== 'M') {
        newBoard[row][col].value = 'M';
        mines--;
      }
    }

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (newBoard[r][c].value === 'M') continue;
        let mineCount = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (r + i >= 0 && r + i < 10 && c + j >= 0 && c + j < 10 && newBoard[r + i][c + j].value === 'M') {
              mineCount++;
            }
          }
        }
        newBoard[r][c].value = mineCount;
      }
    }
    setBoard(newBoard);
  };

  useEffect(() => {
    createBoard();
  }, []);

  const revealCell = (r: number, c: number) => {
    if (gameOver || board[r][c].revealed) return;

    let newBoard = JSON.parse(JSON.stringify(board));
    if (newBoard[r][c].value === 'M') {
      setGameOver(true);
    } else {
      const reveal = (r: number, c: number) => {
        if (r < 0 || r >= 10 || c < 0 || c >= 10 || newBoard[r][c].revealed) return;
        newBoard[r][c].revealed = true;
        if (newBoard[r][c].value === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              reveal(r + i, c + j);
            }
          }
        }
      };
      reveal(r, c);
    }
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">Minesweeper</h1>
      <div className="grid grid-cols-10 gap-1 bg-gray-800 p-2 rounded">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-8 h-8 flex items-center justify-center border border-gray-600 ${cell.revealed ? 'bg-gray-700' : 'bg-gray-600 hover:bg-gray-500'}`}
              onClick={() => revealCell(r, c)}
            >
              {cell.revealed && cell.value !== 0 ? cell.value : ''}
            </div>
          ))
        )}
      </div>
      {(gameOver || gameWon) && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">{gameWon ? 'You Win!' : 'Game Over'}</h2>
          <Button onClick={createBoard} className="gaming-button">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};