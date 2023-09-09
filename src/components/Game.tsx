import usePartySocket from "partysocket/react";
import { useState } from "react";
import Layout from "./Layout";
import { GameState } from "../../game/types";
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

  return (
    <Layout>
      <h1 className="text-2xl border-b border-yellow-400">
        🎲 Guess the number!
      </h1>
      <section>
        <div className="flex flex-col gap-4 py-6 items-center">
          <input
            type="number"
            name="guess"
            id="guess"
            className="border border-black p-2 text-center aspect-square block w-32"
          />
          <button className="rounded border border-black py-5 hover:bg-yellow-400 group">
            Guess!
          </button>
        </div>
        <div className="border-t-2 border-yellow-400">
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
        </div>
      </section>
    </Layout>
  );
};

export default Game;
