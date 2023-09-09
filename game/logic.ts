import { GameState, User } from "./types";

export const initialGame: () => GameState = () => ({
  users: [],
  target: Math.floor(Math.random() * 100),
  log: [],
});

type WithUser<T> = T & { user: User };

export type DefaultAction = { type: "UserEntered" } | { type: "UserExit" };

type GameActions = { type: "guess"; guess: number };

export type Action = DefaultAction | GameActions;

export type ServerAction = WithUser<DefaultAction> | WithUser<GameActions>;

const MAX_LOG_SIZE = 4;

export const gameUpdater = (
  action: ServerAction,
  state: GameState
): GameState => {
  switch (action.type) {
    case "UserEntered":
      return {
        ...state,
        users: [...state.users, action.user],
        log: [`user ${action.user.id} joined 🎉`, ...state.log].slice(
          0,
          MAX_LOG_SIZE
        ),
      };
    case "UserExit":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
        log: [`user ${action.user.id} left 😢`, ...state.log].slice(
          0,
          MAX_LOG_SIZE
        ),
      };
    case "guess":
      console.log(action.guess, state.target);
      if (action.guess === state.target) {
        return {
          ...state,
          target: Math.floor(Math.random() * 100),
          log: [
            `user ${action.user.id} guessed ${action.guess} and won! 👑`,
            ...state.log,
          ].slice(0, MAX_LOG_SIZE),
        };
      } else {
        return {
          ...state,
          log: [
            `user ${action.user.id} guessed ${action.guess} but it isn't the right number.`,
            ...state.log,
          ].slice(0, MAX_LOG_SIZE),
        };
      }
  }
};
