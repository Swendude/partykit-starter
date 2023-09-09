import { GameState, User } from "./types";

export const initialGame: GameState = {
  users: [],
};

export type Action =
  | { type: "UserEntered"; user: User }
  | { type: "UserExit"; user: User };

export const gameUpdater = (action: Action, state: GameState): GameState => {
  switch (action.type) {
    case "UserEntered":
      return { ...state, users: [...state.users, action.user] };
    case "UserExit":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
      };
  }
};
