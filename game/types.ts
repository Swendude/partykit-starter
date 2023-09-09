export interface User {
  id: string;
}

interface BaseGameState {
  users: User[];
  log: {
    dt: number;
    message: string;
  }[];
}

export interface GameState extends BaseGameState {
  target: number;
}
