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

export const DICE_FACES: (1 | 2 | 3 | 4 | 5 | 6)[] = [1, 2, 3, 4, 5, 6];

export type DiceFace = (typeof DICE_FACES)[number];

export type Dice =
  | { status: "removed" }
  | { status: "rolled"; value: DiceFace };

export type DiceSet = [Dice, Dice, Dice, Dice, Dice];

export interface UserInfo {
  dice: null | DiceSet;
}

export type infoMapping = Record<User["id"], UserInfo>;

type Bet = { amount: number; face: DiceFace; userId: User["id"] };

export type GameState = {
  currentUser: User["id"] | null; //null means game not started
  currentBet: Bet | null;
  userInfo: infoMapping;
  rootError: string | null;
} & BaseGameState;

export const initialGame = (): GameState => ({
  users: [],
  userInfo: {},
  currentUser: null,
  currentBet: null,
  log: ["Game Created!"],
  rootError: null,
});

type GameAction =
  | { type: "startGame" }
  | { type: "resetGame" }
  | { type: "makeBet"; bet: Omit<Bet, "userId"> };

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

    case "UserExit": {
      const newState = {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
        log: [...state.log, `user ${action.user.id} left 😢`],
      };

      // If only one player left and the game was started
      if (newState.users.length === 1 && newState.currentUser) {
        return {
          ...resetGame(newState),
          log: [...newState.log, `Single player left in game, game reset`],
        };
      }

      // If the player that just left was betting, continue player.
      if (newState.currentUser === action.user.id) {
        return nextPlayer(newState);
      }

      return newState;
    }

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
      return { ...resetGame(state), log: [...state.log, `Game reset`] };

    case "makeBet":
      if (action.user.id !== state.currentUser) {
        return {
          ...state,
          rootError: `${action.user.id} tried to make a bet but it's not their turn!`,
        };
      } else {
        const newBet = { ...action.bet, userId: action.user.id };
        if (!state.currentBet || betIsHigher(newBet, state.currentBet)) {
          return nextPlayer({
            ...state,
            currentBet: { ...action.bet, userId: action.user.id },
            log: [...state.log, `${action.user.id} made a bet!`],
          });
        } else {
          return {
            ...state,
            rootError: `${action.user.id} tried to make a bet but it was not higher than the previous bet!`,
          };
        }
      }
  }
};

export const betIsHigher = <T extends Omit<Bet, "userId">>(
  bet1: T,
  bet2: T
): boolean => {
  // Either amount or face is higher
  if (bet1.face > bet2.face) return true;
  if (bet1.face === bet2.face && bet1.amount >= bet2.amount) return true;
  return false;
};

export const nextPlayer = (state: GameState): GameState => {
  if (!state.currentUser) {
    throw new Error("Invalid call to nextPlayer, game hasn't started yet!");
  }
  return {
    ...state,
    currentUser:
      state.users[
        (state.users.map((user) => user.id).indexOf(state.currentUser) + 1) %
          state.users.length
      ].id,
  };
};

const resetGame = (game: GameState): GameState => ({
  ...game,
  currentUser: null,
  userInfo: resetAllDice(game.userInfo),
  currentBet: null,
});

export const numDiceInPlay = (state: GameState): number =>
  Object.values(state.userInfo)
    .map((userInfo) =>
      userInfo.dice !== null
        ? userInfo.dice.filter((v) => v.status !== "removed").length
        : 0
    )
    .reduce((a, b) => a + b);

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
