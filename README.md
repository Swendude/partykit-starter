# 🎉 PartyKit Starter

## A starter template made to develop turn-based multiplayer games!

This project is setup as a monorepo contains both a client (written in [Next.js](https://nextjs.org/)) and a server (written in [PartyKit](https://www.partykit.io/)).

The client and server share types and the game logic is updated using a 'reducer' pattern (similar to React's `useReducer` and [Redux](https://redux.js.org/)).

## Getting Started

First, run the client's development server:

```bash
npm run dev
```

Then (in a different terminal) start the server:

```bash
npm run dev:server
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Modifying the code

The code of this project is setup to get going quickly. There are two files that you should modify to create your own game:

- `/src/components/Game.tsx` is the frontend of your game. It is responsible for visualizing a `GameState` object.
- `/game/logic.ts` contains all the logic for the game, the most important parts are the `GameState` interface, the `GameAction` type and the `gameUpdater` function.

### The `GameState` interface

This interface represent all the information you need to keep track of for your game. By default it has two keys:

- `users` a list of `User` objects (you can modify the `User` interface to save additional information about your users)
- `log` which is array of messages with a unix timestamp (`dt`).

You can add extra information to your `GameState` by modifying the interface. In the guessing game, we only need to keep track of one thing: the current target number (see `/game/logic.ts` line 21 to see that).

The `GameState` of your room will be provided to the `Game.tsx` component using the `useGameRoom` hook.

### The `GameAction` type

Think of a `GameAction` like something that can happen to your game. Stuff like 'rolling a dice' or 'making a bet' can be represented by `GameAction`.

Every `GameAction` is required to have a `type: string` field that uniquely defines that action. In our example we only have one `GameAction` with `type: "guess"`. Imagine you wanted to add another action, representing 'placing a bet' we could modify this type like so:

```ts
// Here are all the actions we can dispatch for a user
type GameAction =
  | { type: "guess"; guess: number }
  | { type: "bet"; amount: number };
```

Now there are two actions available to our game. We can place a bet, and make a guess.
You can add whatever information you want to an action (in this case we ask for the `amount`) as long as it has a unique `type` field.

### The `gameUpdater` function

This function is responsible for taking `GameActions` (received from the client, more on that later) and actually updating the `GameState` as needed.

It's a function that receives two arguments:

- a `action` of type `ServerAction`, this is on of your `GameActions` you defined.
- a `state` of type `GameState`, representing the current state of the game

The function must return a new GameState.

This function uses a `switch` statement to match on the `action.type` field and returns an updates `GameState`.

### The `useGameRoom` hook

On the client we only need this hook that provides us with two things:

- `gameState`, the current `GameState` for this room
- `dispatch`, a function the client can use to send `GameActions` to the server

You can use the `gameState` to visualize your game.

The `dispatch` function is the only way to communicate with the server. It sends any of your defined `GameActions`, you do not need to send the `user` field as that is handled on the server. You can see in `Game.tsx` line 31 that we dispatch a `guess` action when the user clicks the guess button.

#### What happens when you dispatch?

When you dispatch an action, it is:

- send to the server from the client
- on the server, the action is modified with the user that did the dispatch
- the server passes the augmented action to the `gameUpdater` which results in a new `GameState`
- All clients receive the new `GameState` (that is called a 'broadcast')
- The server waits until a new action is dispatched

## Building your own game

To build your own game we recommend:

- Start by defining the `GameState`, just like a database model this will hold all the information you need.
- Once the state has been decided on, define some `GameActions` to modify it. What should players be allowed to do and how should the `GameState` be updated?
- Start rendering the `GameState` in the `Game.tsx` component and add some buttons to dispatch the `GameActions`

Happy coding! Make it a party 🎈
