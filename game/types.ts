export interface User {
  id: string;
}

interface BaseGameState {
  users: User[];
}

export interface GameState extends BaseGameState {}
