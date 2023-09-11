// util for easy adding logs
const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
  return [{ dt: new Date().getTime(), message: message }, ...logs].slice(
    0,
    MAX_LOG_SIZE
  );
};

// Liars dice
// Played in turns, n dice per player (5 start)
// Each player rolls n dice
// bid: face & quantity
// overbid: higher quanity or higher face
// OR
// challenge
// If bidder matched: wins
// all losers remove 1 dice

// If there is anything you want to track for a specific user, change this interface
export interface User {
  id: string;
}

// Do not change this! Every game has a list of users and log of actions
interface BaseGameState {
  users: User[];
  log: {
    dt: number;
    message: string;
  }[];
}

// Do not change!
export type Action = DefaultAction | GameAction;

// Do not change!
export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

// The maximum log size, change as needed
const MAX_LOG_SIZE = 4;

type WithUser<T> = T & { user: User };

export type DefaultAction = { type: "UserEntered" } | { type: "UserExit" };

// This interface holds all the information about your game
export interface GameState extends BaseGameState {
  target: number;
  currentUser: User["id"] | null; //null means game not started
  rootError: string | null;
}

// This is how a fresh new game starts out, it's a function so you can make it dynamic!
// In the case of the guesser game we start out with a random target
export const initialGame = (): GameState => ({
  users: [],
  currentUser: null,
  target: Math.floor(Math.random() * 100),
  log: [{ dt: 0, message: "Game Created!" }],
  rootError: null,
});

// Here are all the actions we can dispatch for a user
type GameAction = { type: "guess"; guess: number } | { type: "startGame" };

export const gameUpdater = (
  action: ServerAction,
  state: GameState
): GameState => {
  // This switch should have a case for every action type you add.

  // "UserEntered" & "UserExit" are defined by default

  // Every action has a user field that represent the user who dispatched the action,
  // you don't need to add this yourself

  // Reset the error before handling any actions
  state.rootError = null;

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
    case "startGame":
      if (state.users.length < 2) {
        return {
          ...state,
          rootError: "Game can't be started with less than two players",
        };
      } else {
        return {
          ...state,
          currentUser: state.users[0].id,
        };
      }
  }
};
