import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

export const Chess = () => {
  // Simplified Chess Logic
  const [turn, setTurn] = useState('w');

  const handleMove = () => {
    setTurn(turn === 'w' ? 'b' : 'w');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">Chess</h1>
      <div className="text-2xl mb-4">It's {turn === 'w' ? 'White' : 'Black'}'s turn</div>
        <div className="w-96 h-96 bg-gray-500 grid grid-cols-8 grid-rows-8">
        {Array(64).fill(null).map((_, i) => (
            <div key={i} className={`w-12 h-12 ${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-600'}`}></div>
        ))}
        </div>
      <div className="mt-4">
        <Button onClick={handleMove} className="gaming-button">
          Next Turn
        </Button>
      </div>
    </div>
  );
};