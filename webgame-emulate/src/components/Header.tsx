import { Search, Menu, Star, Trophy, Gamepad2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { name: 'All Games', icon: Gamepad2, color: 'bg-primary' },
  { name: 'Action', icon: Trophy, color: 'bg-red-500' },
  { name: 'Puzzle', icon: Star, color: 'bg-yellow-500' },
  { name: 'Racing', icon: Trophy, color: 'bg-green-500' },
  { name: 'Adventure', icon: Star, color: 'bg-purple-500' }
];

export const Header = ({ onSearch, onCategorySelect }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Games");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <header className="relative z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Search Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Poki Logo */}
            <div className="bg-white rounded-2xl p-3 shadow-lg">
              <h1 className="text-2xl font-bold text-primary">POKI</h1>
            </div>
            <Button variant="ghost" className="text-white/80 hover:text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/60 rounded-2xl"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-white/80 hover:text-white">
              <Star className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            
            return (
              <Button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                variant="ghost"
                className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all whitespace-nowrap ${
                  isSelected 
                    ? 'bg-white text-primary shadow-lg scale-105' 
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{category.name}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};