import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎯', '🚀', '⚡', '🌟', '🎪', '🎨', '🎭', '🎪', '🎸', '🎺', '🎲'];

export const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'won'>('menu');
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy': return { pairs: 6, cols: 4 };
      case 'medium': return { pairs: 8, cols: 4 };
      case 'hard': return { pairs: 12, cols: 6 };
      default: return { pairs: 8, cols: 4 };
    }
  };

  const initializeGame = useCallback(() => {
    const { pairs } = getDifficultySettings();
    const selectedEmojis = EMOJIS.slice(0, pairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    const shuffledCards: Card[] = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
  }, [difficulty]);

  const handleCardClick = (cardId: number) => {
    if (gameState !== 'playing') return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(prev => {
            const newMatches = prev + 1;
            const { pairs } = getDifficultySettings();
            if (newMatches === pairs) {
              setGameState('won');
            }
            return newMatches;
          });
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const startGame = () => {
    initializeGame();
    setGameState('playing');
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const { cols } = getDifficultySettings();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 text-primary">Memory Game</h1>
        <div className="flex justify-center space-x-8 text-lg">
          <span>Moves: {moves}</span>
          <span>Matches: {matches}</span>
          <span>Time: {formatTime(timer)}</span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-6">Choose Difficulty</h2>
          
          <div className="space-y-4 mb-6">
            {[
              { key: 'easy', label: 'Easy', desc: '6 pairs (4x3)' },
              { key: 'medium', label: 'Medium', desc: '8 pairs (4x4)' },
              { key: 'hard', label: 'Hard', desc: '12 pairs (6x4)' }
            ].map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => setDifficulty(key as any)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  difficulty === key
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="font-bold">{label}</div>
                <div className="text-sm text-gray-400">{desc}</div>
              </button>
            ))}
          </div>

          <Button onClick={startGame} className="gaming-button">
            Start Game
          </Button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <div 
            className="grid gap-3"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              maxWidth: `${cols * 80 + (cols - 1) * 12}px`
            }}
          >
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  w-20 h-20 rounded-lg border-2 text-2xl font-bold transition-all duration-300 transform
                  ${card.isFlipped || card.isMatched
                    ? card.isMatched 
                      ? 'bg-green-500 border-green-400 scale-110' 
                      : 'bg-primary border-primary-foreground'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  }
                  ${card.isMatched ? 'animate-pulse' : ''}
                  hover:scale-105
                `}
                disabled={card.isMatched || flippedCards.length === 2}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '❓'}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'won' && (
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-400">🎉 Congratulations! 🎉</h2>
          <div className="space-y-2 mb-6 text-lg">
            <p>You completed the {difficulty} level!</p>
            <p>Time: {formatTime(timer)}</p>
            <p>Moves: {moves}</p>
            <p>Efficiency: {Math.round((matches / moves) * 100)}%</p>
          </div>
          
          <div className="space-x-4">
            <Button onClick={startGame} className="gaming-button">
              Play Again
            </Button>
            <Button onClick={() => setGameState('menu')} variant="outline">
              Change Difficulty
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};