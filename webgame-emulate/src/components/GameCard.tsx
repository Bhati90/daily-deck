import { Play } from "lucide-react";
import { Game } from "@/types/game";

interface GameCardProps {
  game: Game;
  size?: 'small' | 'medium' | 'large';
  onClick: () => void;
}

export const GameCard = ({ game, size = 'medium', onClick }: GameCardProps) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1 min-h-[200px]',
    medium: 'col-span-1 row-span-1 min-h-[220px] md:col-span-1 md:row-span-1',
    large: 'col-span-2 row-span-2 min-h-[300px] md:col-span-2 md:row-span-2'
  };

  return (
    <div 
      className={`game-card group relative overflow-hidden ${sizeClasses[size]} glow`}
      onClick={onClick}
      style={{ 
        backgroundColor: game.backgroundColor || '#ffffff',
        '--glow-color': game.backgroundColor 
      } as React.CSSProperties}
    >
      {/* Game Image/Preview */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent">
        {game.thumbnail ? (
          <img 
            src={game.thumbnail} 
            alt={game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white text-6xl font-bold"
            style={{ backgroundColor: game.backgroundColor }}
          >
            {game.title.charAt(0)}
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg mb-1">{game.title}</h3>
          <p className="text-sm text-white/80 mb-3">{game.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {game.category}
            </span>
            <div className="flex items-center space-x-1 text-xs">
              <span>★</span>
              <span>{game.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Play Button */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
          <Play className="h-8 w-8 text-primary fill-current ml-1" />
        </div>
      </div>

      {/* Title (always visible) */}
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-bold text-white text-sm md:text-base drop-shadow-lg group-hover:opacity-0 transition-opacity duration-300">
          {game.title}
        </h3>
      </div>
    </div>
  );
};