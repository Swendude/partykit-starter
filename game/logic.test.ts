import {
  UserInfo,
  User,
  rollAllDice,
  resetAllDice,
  GameState,
  initialGame,
  nextPlayer,
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
