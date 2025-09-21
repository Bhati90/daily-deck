import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { GameGrid } from "@/components/GameGrid";
import { GameModal } from "@/components/GameModal";
import { Game, GameCategory } from "@/types/game";
import { games } from "@/data/games";

const Index = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("All Games");
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  // Filter games based on search and category
  const filteredGames = useMemo(() => {
    let filtered = games;

    // Filter by category
    if (selectedCategory !== "All Games") {
      filtered = filtered.filter(game => game.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category as GameCategory);
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
      />

      {/* Main Content */}
      <main className="relative z-0">
        {/* Hero Section */}
        <section className="px-6 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Free Online Games
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Play the best free games instantly! No downloads, no ads, just pure gaming fun.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 text-white/60 text-sm">
              <span>{games.length} Games Available</span>
              <span>•</span>
              <span>100% Free</span>
              <span>•</span>
              <span>No Downloads Required</span>
            </div>
          </div>
        </section>

        {/* Results Info */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery || selectedCategory !== "All Games" 
                  ? `${filteredGames.length} ${filteredGames.length === 1 ? 'Game' : 'Games'} Found`
                  : `Featured Games`
                }
              </h2>
              
              {(searchQuery || selectedCategory !== "All Games") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Games");
                  }}
                  className="text-white/60 hover:text-white text-sm underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
                <p className="text-white/60 mb-4">
                  Try adjusting your search or browse a different category
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Games");
                  }}
                  className="gaming-button"
                >
                  Show All Games
                </button>
              </div>
            ) : (
              <GameGrid games={filteredGames} onGameSelect={handleGameSelect} />
            )}
          </div>
        </section>
      </main>

      {/* Game Modal */}
      <GameModal 
        game={selectedGame}
        isOpen={isGameModalOpen}
        onClose={closeGameModal}
      />
    </div>
  );
};

export default Index;