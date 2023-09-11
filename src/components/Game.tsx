import { useEffect, useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { randomMeme } from "../../game/logic";

interface GameProps {
  username: string;
  roomId: string;
}

export interface RandomMemes {
  id: string;
  name: string;
  url: string;
  width?: number;
  height?: number;
  box_count?: number;
  captions?: number;
}

const Game = ({ username, roomId }: GameProps) => {
  const { gameState, dispatch } = useGameRoom(username, roomId);
  console.log(gameState);
  // Local state to use for the UI
  const [guess, setGuess] = useState<number>(0);

  // const [randomMemes, setRandomMemes] = useState<RandomMemes[] | []>([]);

  // useEffect(() => {
  //   const random = randomMeme();
  //   if (random) {
  //     setRandomMemes(random);
  //   } else {
  //     return;
  //   }
  // }, []);

  // Indicated that the game is loading
  if (gameState === null) {
    return (
      <p>
        <span className="transition-all w-fit inline-block mr-4 animate-bounce">
          🎲
        </span>
        Waiting for server...
      </p>
    );
  }

  const handleGuess = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // Dispatch allows you to send an action!
    // Modify /game/logic.ts to change what actions you can send
    dispatch({ type: "guess", guess: guess });
  };

  return (
    <>
      <h1 className="text-2xl border-b border-yellow-400 text-center relative">
        🎲 Guess the number!
      </h1>
      {gameState.memes.map((meme) => {
        return (
          <div key={meme.id}>
            <p>{meme.name}</p>
            <img src={meme.url} />
          </div>
        );
      })}

      <section>
        <form
          className="flex flex-col gap-4 py-6 items-center"
          onSubmit={handleGuess}
        >
          <label
            htmlFor="guess"
            className="text-7xl font-bold text-stone-50 bg-black rounded p-2 text-"
          >
            Random Meme 1
          </label>
          <input
            type="radio"
            name="guess"
            id="guess"
            className="opacity-70 hover:opacity-100 accent-yellow-400"
            onChange={(e) => setGuess(Number(e.currentTarget.value))}
            value={guess}
          />
          <label
            htmlFor="guess"
            className="text-7xl font-bold text-stone-50 bg-black rounded p-2 text-"
          >
            Random Meme 2
          </label>
          <input
            type="radio"
            name="guess"
            id="guess"
            className="opacity-70 hover:opacity-100 accent-yellow-400"
            onChange={(e) => setGuess(Number(e.currentTarget.value))}
            value={guess}
          />
          <label
            htmlFor="guess"
            className="text-7xl font-bold text-stone-50 bg-black rounded p-2 text-"
          >
            Random Meme 3
          </label>
          <input
            type="radio"
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
        {/* <button
          className="border border-black p-5"
          onClick={() => dispatch({ type: "bet", amount: 100 })}
        >
          Bet!
        </button> */}

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
