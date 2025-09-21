import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

export const Checkers = () => {
  // Simplified Checkers Logic
  const [board, setBoard] = useState(
    Array(8).fill(null).map((_, r) =>
      Array(8).fill(null).map((_, c) => {
        if ((r + c) % 2 !== 0) {
          if (r < 3) return 'b';
          if (r > 4) return 'w';
        }
        return null;
      })
    )
  );
  const [turn, setTurn] = useState('w');

  const handleMove = () => {
    // Placeholder for move logic
    setTurn(turn === 'w' ? 'b' : 'w');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">Checkers</h1>
      <div className="grid grid-cols-8 gap-0 bg-gray-800 p-2 rounded">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className={`w-12 h-12 flex items-center justify-center ${(r + c) % 2 === 0 ? 'bg-gray-400' : 'bg-gray-700'}`}>
              {cell && <div className={`w-10 h-10 rounded-full ${cell === 'w' ? 'bg-white' : 'bg-black'}`} />}
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <Button onClick={handleMove} className="gaming-button">
          Next Turn
        </Button>
      </div>
    </div>
  );
};