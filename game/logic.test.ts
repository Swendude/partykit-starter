import {
  UserInfo,
  User,
  rollAllDice,
  resetAllDice,
  GameState,
  initialGame,
  nextPlayer,
  diceCount,
} from "./logic";

const emptyInfo: Record<User["id"], UserInfo> = {
  ["1"]: { dice: null },
  ["2"]: { dice: null },
  ["3"]: { dice: null },
};

test("rollDiceForAllUsers rolls dice", () => {
  for (let key in emptyInfo) {
    expect(rollAllDice(emptyInfo)[key].dice).not.toBeNull;
    expect(rollAllDice(emptyInfo)[key].dice?.length).toBe(5);
  }
});

test("resetAllDice resets dice", () => {
  const rolled = rollAllDice(emptyInfo);
  for (let key in rolled) {
    expect(resetAllDice(rolled)[key].dice).toBeNull;
  }
});

test("nextPlayer selects the next player", () => {
  const thisGame: GameState = {
    ...initialGame(),
    users: [{ id: "Bob" }, { id: "Alice" }, { id: "Joe" }, { id: "Jane" }],
    currentUser: "Bob",
  };
  expect(nextPlayer(thisGame).currentUser).toBe("Alice");
});

test("nextPlayer selects the next player and loops around", () => {
  const thisGame: GameState = {
    ...initialGame(),
    users: [{ id: "Bob" }, { id: "Alice" }, { id: "Joe" }, { id: "Jane" }],
    currentUser: "Jane",
  };
  expect(nextPlayer(thisGame).currentUser).toBe("Bob");
});

test("diceCount generates a proper count", () => {
  const thisGame: GameState = {
    ...initialGame(),
    users: [{ id: "Bob" }, { id: "Alice" }],
    userInfo: {
      ["Bob"]: {
        dice: [
          { status: "rolled", value: 1 },
          { status: "rolled", value: 1 },
          { status: "rolled", value: 2 },
          { status: "rolled", value: 1 },
          { status: "rolled", value: 4 },
        ],
      },
      ["Alice"]: {
        dice: [
          { status: "rolled", value: 6 },
          { status: "rolled", value: 3 },
          { status: "rolled", value: 4 },
          { status: "rolled", value: 1 },
          { status: "rolled", value: 3 },
        ],
      },
    },
  };

  expect(diceCount(thisGame)).toEqual({
    1: 4,
    2: 1,
    3: 2,
    4: 2,
    5: 0,
    6: 1,
  });
});
