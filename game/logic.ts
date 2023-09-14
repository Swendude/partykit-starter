export interface User {
  id: string;
}

interface BaseGameState {
  users: User[];
  log: string[];
}

export type Action = DefaultAction | GameAction;

export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

const MAX_LOG_SIZE = 4;

type WithUser<T> = T & { user: User };

export type DefaultAction = { type: "UserEntered" } | { type: "UserExit" };

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

export const DICE_FACES: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];

export type DiceSet = [Dice, Dice, Dice, Dice, Dice];

export interface UserInfo {
  dice: null | DiceSet;
}

export type infoMapping = Record<User["id"], UserInfo>;

export interface GameState extends BaseGameState {
  target: number;
  currentUser: User["id"] | null; //null means game not started
  userInfo: infoMapping;
  rootError: string | null;
}

export const initialGame = (): GameState => ({
  users: [],
  userInfo: {},
  currentUser: null,
  target: Math.floor(Math.random() * 100),
  log: ["Game Created!"],
  rootError: null,
});

type GameAction = { type: "startGame" } | { type: "resetGame" };

export const gameUpdater = (
  action: ServerAction,
  state: GameState
): GameState => {
  state.rootError = null;

  switch (action.type) {
    case "UserEntered":
      const seen = Object.keys(state.userInfo).find(
        (id) => id === action.user.id
      );
      console.log(seen);
      if (seen) {
        return {
          ...state,
          users: [...state.users, action.user],
          log: [...state.log, `user ${action.user.id} joined 🎉`],
        };
      }
      return {
        ...state,
        users: [...state.users, action.user],
        userInfo: { ...state.userInfo, [action.user.id]: { dice: null } },
        log: [...state.log, `user ${action.user.id} joined 🎉`],
      };

    case "UserExit":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
        log: [...state.log, `user ${action.user.id} left 😢`],
      };

    case "startGame":
      if (state.users.length < 2) {
        return {
          ...state,
          rootError: "Game needs atleast two players",
        };
      }

      if (state.currentUser !== null) {
        return {
          ...state,
          rootError: "Game already started",
        };
      }
      return {
        ...state,
        currentUser: randomChoice(state.users).id,
        userInfo: rollAllDice(state.userInfo),
        log: [...state.log, `Game started, good luck!`],
      };

    case "resetGame":
      return {
        ...state,
        currentUser: null,
        userInfo: resetAllDice(state.userInfo),
        log: [...state.log, `Game reset`],
      };
  }
};

export const rollAllDice = (info: infoMapping): infoMapping => {
  return Object.keys(info).reduce((acc, userId) => {
    return {
      ...acc,
      [userId]: { ...info[userId], dice: rollDice(info[userId].dice) },
    };
  }, {});
};

export const resetAllDice = (info: infoMapping): infoMapping => {
  return Object.keys(info).reduce((acc, userId) => {
    return {
      ...acc,
      [userId]: { ...info[userId], dice: null },
    };
  }, {});
};

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
