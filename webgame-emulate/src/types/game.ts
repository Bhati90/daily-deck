export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  thumbnail?: string;
  backgroundColor: string;
  component: React.ComponentType;
  featured?: boolean;
}

export type GameCategory = 'All Games' | 'Action' | 'Puzzle' | 'Racing' | 'Adventure';