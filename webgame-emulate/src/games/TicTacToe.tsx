import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameMode = 'pvp' | 'ai';
type Difficulty = 'easy' | 'hard';

export const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });

  const checkWinner = useCallback((board: Board): Player | 'tie' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.every(cell => cell !== null) ? 'tie' : null;
  }, []);

  const getAvailableMoves = (board: Board): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  };

  const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board);
    
    if (winner === 'O') return 10 - depth; // AI wins
    if (winner === 'X') return depth - 10; // Human wins
    if (winner === 'tie') return 0; // Tie

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = 'O';
        const score = minimax(board, depth + 1, false);
        board[move] = null;
        maxScore = Math.max(maxScore, score);
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = 'X';
        const score = minimax(board, depth + 1, true);
        board[move] = null;
        minScore = Math.min(minScore, score);
      }
      return minScore;
    }
  };

  const getBestMove = (board: Board): number => {
    if (difficulty === 'easy') {
      // Easy: Random move with occasional good move
      const availableMoves = getAvailableMoves(board);
      if (Math.random() < 0.3) {
        // 30% chance to make optimal move
        let bestMove = availableMoves[0];
        let bestValue = -Infinity;
        
        for (const move of availableMoves) {
          board[move] = 'O';
          const moveValue = minimax(board, 0, false);
          board[move] = null;
          
          if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
          }
        }
        return bestMove;
      } else {
        // 70% chance to make random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    } else {
      // Hard: Always optimal move using minimax
      const availableMoves = getAvailableMoves(board);
      let bestMove = availableMoves[0];
      let bestValue = -Infinity;
      
      for (const move of availableMoves) {
        board[move] = 'O';
        const moveValue = minimax(board, 0, false);
        board[move] = null;
        
        if (moveValue > bestValue) {
          bestValue = moveValue;
          bestMove = move;
        }
      }
      return bestMove;
    }
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores(prev => ({
        ...prev,
        [gameWinner === 'tie' ? 'ties' : gameWinner]: prev[gameWinner === 'tie' ? 'ties' : gameWinner as 'X' | 'O'] + 1
      }));
    } else if (gameMode === 'ai' && currentPlayer === 'X') {
      // AI makes move after a short delay
      setTimeout(() => {
        const aiMove = getBestMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);

        const aiWinner = checkWinner(aiBoard);
        if (aiWinner) {
          setWinner(aiWinner);
          setScores(prev => ({
            ...prev,
            [aiWinner === 'tie' ? 'ties' : aiWinner]: prev[aiWinner === 'tie' ? 'ties' : aiWinner as 'X' | 'O'] + 1
          }));
        } else {
          setCurrentPlayer('X');
        }
      }, 500);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, ties: 0 });
  };

  const getPlayerLabel = (player: 'X' | 'O') => {
    if (gameMode === 'pvp') {
      return `Player ${player}`;
    }
    return player === 'X' ? 'You' : 'AI';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-4 text-primary">Tic Tac Toe</h1>
        
        {/* Scores */}
        <div className="flex justify-center space-x-8 text-lg mb-4">
          <span className="text-blue-400">{getPlayerLabel('X')}: {scores.X}</span>
          <span className="text-gray-400">Ties: {scores.ties}</span>
          <span className="text-red-400">{getPlayerLabel('O')}: {scores.O}</span>
        </div>

        {/* Game Mode Selection */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            onClick={() => {
              setGameMode('pvp');
              resetGame();
            }}
            variant={gameMode === 'pvp' ? 'default' : 'outline'}
            className="text-sm"
          >
            Player vs Player
          </Button>
          <Button
            onClick={() => {
              setGameMode('ai');
              resetGame();
            }}
            variant={gameMode === 'ai' ? 'default' : 'outline'}
            className="text-sm"
          >
            vs AI
          </Button>
        </div>

        {/* AI Difficulty */}
        {gameMode === 'ai' && (
          <div className="flex justify-center space-x-4 mb-4">
            <Button
              onClick={() => setDifficulty('easy')}
              variant={difficulty === 'easy' ? 'default' : 'outline'}
              size="sm"
            >
              Easy AI
            </Button>
            <Button
              onClick={() => setDifficulty('hard')}
              variant={difficulty === 'hard' ? 'default' : 'outline'}
              size="sm"
            >
              Hard AI
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
        {/* Game Status */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="text-2xl font-bold">
              {winner === 'tie' ? (
                <span className="text-yellow-400">It's a Tie! 🤝</span>
              ) : (
                <span className={winner === 'X' ? 'text-blue-400' : 'text-red-400'}>
                  {getPlayerLabel(winner)} Wins! 🎉
                </span>
              )}
            </div>
          ) : (
            <div className="text-xl">
              <span className={currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400'}>
                {getPlayerLabel(currentPlayer)}'s Turn
              </span>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 w-72 mx-auto mb-6">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => makeMove(index)}
              disabled={!!cell || !!winner || (gameMode === 'ai' && currentPlayer === 'O')}
              className={`
                w-20 h-20 text-3xl font-bold border-2 rounded-lg transition-all duration-200
                ${cell === 'X' ? 'text-blue-400 bg-blue-400/20 border-blue-400' : ''}
                ${cell === 'O' ? 'text-red-400 bg-red-400/20 border-red-400' : ''}
                ${!cell ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:scale-105' : ''}
                ${!!winner ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={resetGame} className="gaming-button">
            New Game
          </Button>
          <Button onClick={resetScores} variant="outline">
            Reset Scores
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>{gameMode === 'ai' ? 'Click to play against AI' : 'Take turns clicking squares'}</p>
      </div>
    </div>
  );
};