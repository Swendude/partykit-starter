import { GameState, User } from "./types";

export const initialGame: () => GameState = () => ({
  users: [],
  target: Math.floor(Math.random() * 100),
  log: addLog("Game Created!", []),
});

type WithUser<T> = T & { user: User };

export type DefaultAction = { type: "UserEntered" } | { type: "UserExit" };

type GameActions = { type: "guess"; guess: number };

export type Action = DefaultAction | GameActions;

export type ServerAction = WithUser<DefaultAction> | WithUser<GameActions>;

const MAX_LOG_SIZE = 4;

// util for easy adding logs
const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
  return [{ dt: new Date().getTime(), message: message }, ...logs].slice(
    0,
    MAX_LOG_SIZE
  );
};

export const gameUpdater = (
  action: ServerAction,
  state: GameState
): GameState => {
  switch (action.type) {
    case "UserEntered":
      return {
        ...state,
        users: [...state.users, action.user],
        log: addLog(`user ${action.user.id} joined 🎉`, state.log),
      };
    case "UserExit":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
        log: addLog(`user ${action.user.id} left 😢`, state.log),
      };
    case "guess":
      console.log(action.guess, state.target);
      if (action.guess === state.target) {
        return {
          ...state,
          target: Math.floor(Math.random() * 100),
          log: addLog(
            `user ${action.user.id} guessed ${action.guess} and won! 👑`,
            state.log
          ),
        };
      } else {
        return {
          ...state,
          log: addLog(
            `user ${action.user.id} guessed ${action.guess}`,
            state.log
          ),
        };
      }
  }
};
