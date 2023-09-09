import usePartySocket from "partysocket/react";
import { useState } from "react";
import Layout from "./Layout";
import { GameState } from "../../game/types";
import { Action } from "../../game/logic";

interface GameProps {
  username: string;
  roomId: string;
}

const Game = ({ username, roomId }: GameProps) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socket = usePartySocket({
    host: "127.0.0.1:1999",
    room: roomId,
    id: username,
    onMessage(event: MessageEvent<string>) {
      setGameState(JSON.parse(event.data));
    },
  });

  const dispatch = (action: Action) => {
    socket.send(JSON.stringify(action));
  };

  const [guess, setGuess] = useState<number>(0);

  if (gameState === null) {
    return (
      <Layout>
        <p>
          <span className="transition-all w-fit inline-block mr-4 animate-bounce">
            🎲
          </span>
          Waiting for server...
        </p>
      </Layout>
    );
  }

  const handleGuess = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch({ type: "guess", guess: guess });
  };

  return (
    <>
      <h1 className="text-2xl border-b border-yellow-400 text-center relative">
        🎲 Guess the number!
      </h1>
      <section>
        <form
          className="flex flex-col gap-4 py-6 items-center"
          onSubmit={handleGuess}
        >
          <label
            htmlFor="guess"
            className="text-7xl font-bold text-stone-50 bg-black rounded p-2 text-"
          >
            {guess}
          </label>
          <input
            type="range"
            name="guess"
            id="guess"
            className="opacity-70 hover:opacity-100 accent-yellow-400"
            onChange={(e) => setGuess(Number(e.currentTarget.value))}
            value={guess}
          />
          <button className="rounded border p-5 bg-yellow-400 group text-black shadow hover:shadow-lg transition-all duration-200 hover:animate-wiggle">
            Guess!
          </button>
        </form>

        <div className="border-t border-yellow-400 py-2" />

        <div className=" bg-yellow-100 flex flex-col p-4 rounded text-sm">
          {gameState.log.map((logEntry, i) => (
            <p key={logEntry.dt} className="animate-appear text-black">
              {logEntry.message}
            </p>
          ))}
        </div>

        <h2 className="text-lg">
          Players in room <span className="font-bold">{roomId}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {gameState.users.map((user) => {
            return (
              <p
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-black text-white"
                key={user.id}
              >
                {user.id}
              </p>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Game;
