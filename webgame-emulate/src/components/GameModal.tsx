import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Game } from "@/types/game";
import { useState } from "react";

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GameModal = ({ game, isOpen, onClose }: GameModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!game) return null;

  const GameComponent = game.component;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`p-0 border-0 bg-transparent shadow-none max-w-none ${
          isFullscreen ? 'h-screen w-screen' : 'max-w-4xl w-full h-[80vh]'
        }`}
      >
        {/* Game Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800/95 backdrop-blur-sm rounded-t-lg">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">{game.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>⭐ {game.rating}</span>
              <span>•</span>
              <span>{game.category}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Content */}
        <div className="flex-1 overflow-hidden bg-gray-900 rounded-b-lg">
          <GameComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
};