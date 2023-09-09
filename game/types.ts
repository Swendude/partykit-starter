export interface User {
  id: string;
}

interface BaseGameState {
  users: User[];
  log: string[];
}

export interface GameState extends BaseGameState {
  target: number;
}
