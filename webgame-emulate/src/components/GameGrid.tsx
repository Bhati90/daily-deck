import { GameCard } from "./GameCard";
import { Game } from "@/types/game";
import { useState } from "react";

interface GameGridProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
}

export const GameGrid = ({ games, onGameSelect }: GameGridProps) => {
  const [visibleGames, setVisibleGames] = useState(20);

  const loadMoreGames = () => {
    setVisibleGames(prev => Math.min(prev + 20, games.length));
  };

  const displayedGames = games.slice(0, visibleGames);

  // Create a responsive grid with varying sizes
  const getGameSize = (index: number): 'small' | 'medium' | 'large' => {
    // Featured games get large size
    if (displayedGames[index]?.featured) return 'large';
    
    // Some pattern for variety - every 7th and 11th game gets large size
    if ((index + 1) % 7 === 0 || (index + 1) % 11 === 0) return 'large';
    
    // Most games are medium
    return 'medium';
  };

  return (
    <div className="px-6 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-fr">
          {displayedGames.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              size={getGameSize(index)}
              onClick={() => onGameSelect(game)}
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleGames < games.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreGames}
              className="gaming-button"
            >
              Load More Games ({games.length - visibleGames} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};