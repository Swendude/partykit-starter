import { useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { stringToColor } from "@/utils";
import { Badge } from "./ui/badge";

interface GameProps {
  username: string;
  roomId: string;
}

const Game = ({ username, roomId }: GameProps) => {
  const { gameState, dispatch } = useGameRoom(username, roomId);

  // Local state to use for the UI
  const [guess, setGuess] = useState<number>(0);

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
      <section>
        {gameState.currentUser === null ? (
          <button onClick={() => dispatch({ type: "startGame" })}>
            Start game
          </button>
        ) : (
          <p>{`${gameState.currentUser}'s turn`}</p>
        )}
        {gameState.rootError && (
          <p className="text-red-600 font-bold">{gameState.rootError}</p>
        )}

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
              <Badge
                style={{ backgroundColor: stringToColor(user.id + roomId) }}
                key={user.id}
              >
                {user.id}
              </Badge>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Game;
