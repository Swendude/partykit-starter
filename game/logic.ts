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

export type Dice =
  | { status: "removed" }
  | { status: "rolled"; value: (typeof DICE_FACES)[number] };

const DICE_FACES: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];

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

interface UserInfo {
  dice: null | [Dice, Dice, Dice, Dice, Dice];
}

// This interface holds all the information about your game
export interface GameState extends BaseGameState {
  target: number;
  currentUser: User["id"] | null; //null means game not started
  userInfo: Record<User["id"], UserInfo>;
  rootError: string | null;
}

// This is how a fresh new game starts out, it's a function so you can make it dynamic!
// In the case of the guesser game we start out with a random target
export const initialGame = (): GameState => ({
  users: [],
  userInfo: {},
  currentUser: null,
  target: Math.floor(Math.random() * 100),
  log: [{ dt: 0, message: "Game Created!" }],
  rootError: null,
});

// Here are all the actions we can dispatch for a user
type GameAction = { type: "startGame" };

const randomChoice = <T>(a: T[]): T => {
  return a[Math.floor(Math.random() * a.length)];
};

const rollDice = (dice: UserInfo["dice"]): UserInfo["dice"] => {
  if (dice === null) {
    return [
      { status: "rolled", value: randomChoice(DICE_FACES) },
      { status: "rolled", value: randomChoice(DICE_FACES) },
      { status: "rolled", value: randomChoice(DICE_FACES) },
      { status: "rolled", value: randomChoice(DICE_FACES) },
      { status: "rolled", value: randomChoice(DICE_FACES) },
    ];
  }
  const newDice = dice.map((d) => {
    if (d.status !== "removed") {
      return { status: "rolled", value: randomChoice(DICE_FACES) };
    }
    return d;
  }) as [Dice, Dice, Dice, Dice, Dice];
  return newDice;
};

export const gameUpdater = (
  action: ServerAction,
  state: GameState
): GameState => {
  state.rootError = null;

  switch (action.type) {
    case "UserEntered":
      return {
        ...state,
        users: [...state.users, action.user],
        userInfo: { ...state.userInfo, [action.user.id]: { dice: null } },
        log: addLog(`user ${action.user.id} joined 🎉`, state.log),
      };

    case "UserExit":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
        log: addLog(`user ${action.user.id} left 😢`, state.log),
      };

    case "startGame":
      if (state.users.length < 2) {
        return {
          ...state,
          rootError: "Game needs atleast two players",
        };
      } else {
        let newInfos: GameState["userInfo"] = {};
        for (const userId in state.userInfo) {
          newInfos[userId] = {
            ...state.userInfo[userId],
            dice: rollDice(state.userInfo[userId].dice),
          };
        }
        return {
          ...state,
          currentUser: randomChoice(state.users).id,
          userInfo: { ...newInfos },
        };
      }
  }
};
