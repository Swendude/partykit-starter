import { useEffect, useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";

import { Dices, User2 } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";

import { ResetDialogButton } from "./reset-dialog";
import { LogView } from "./log-view";
import { LeaveDialogButton } from "./leave-dialog";
import { DiceSet } from "./diceset";
import { cn } from "@/lib/utils";
import { BetForm, BetView } from "./bet-form";

import { DiceSet as DiceSetT, numDiceInPlay } from "../../game/logic";

interface GameProps {
  username: string;
  roomId: string;
  leaveRoom: () => void;
}

const Game = ({ username, roomId, leaveRoom }: GameProps) => {
  const { toast } = useToast();
  const { gameState, dispatch } = useGameRoom(username, roomId);

  useEffect(() => {
    if (gameState && gameState.rootError) {
      console.log(gameState.rootError);
      const a = toast({
        description: gameState.rootError,
        variant: "destructive",
      });
      console.log(a);
    }
  }, [gameState, toast]);

  // useEffect(() => {
  //   console.log(gameState);
  // }, [gameState]);

  // Indicated that the game is loading
  if (gameState === null) {
    return (
      <p className="p-4">
        <Dices className="inline transition-all animate-bounce" /> Waiting for
        server...
      </p>
    );
  }

  const usersTurn = gameState.currentUser === username;

  return (
    <div className="flex flex-col gap-y-4 w-[500px]">
      <div className="space-y-2">
        {gameState.users.map((user) => (
          <Player
            id={user.id}
            key={user.id}
            dice={gameState.userInfo[user.id].dice}
            self={user.id === username}
            current={user.id === gameState.currentUser}
          />
        ))}
      </div>

      <Separator />
      <div className="flex flex-col items-center">
        <h3>Current Bet</h3>
        {gameState.currentBet ? (
          <BetView bet={gameState.currentBet} />
        ) : (
          <p className="text-2xl">No bet yet</p>
        )}
      </div>
      <Separator />
      <div className="mx-auto text-center">
        {gameState.currentUser === null ? (
          <>
            <Button
              className="w-fit animate-pulse"
              variant={"outline"}
              onClick={() => dispatch({ type: "startGame" })}
            >
              Click to start game
            </Button>
          </>
        ) : (
          <>
            {usersTurn ? (
              <h3>Make your Bet</h3>
            ) : (
              <h3>{gameState.currentUser}'s turn</h3>
            )}
            <BetForm
              active={usersTurn}
              current={gameState.currentBet}
              maxDice={numDiceInPlay(gameState)}
              onBet={(bet) => dispatch({ type: "makeBet", bet })}
            />
          </>
        )}
      </div>

      <Separator />

      <div className="flex justify-between items-end">
        <ResetDialogButton onConfirm={() => dispatch({ type: "resetGame" })} />
        <p className="text-sm">
          Room:{" "}
          <span className="text-secondary bg-primary p-1 px-2 rounded">
            {roomId}
          </span>
        </p>
        <LeaveDialogButton onConfirm={leaveRoom} />
      </div>
    </div>
  );
};

const Player = ({
  id,
  dice,
  current,
  self,
}: {
  id: string;
  self: boolean;
  dice: DiceSetT | null;
  current: boolean;
}) => {
  return (
    <div
      className={cn(
        "border rounded-xl p-2 flex gap-4 items-center pl-4 justify-between",
        current && "border-primary border-2"
      )}
    >
      <h3 className="text-2xl truncate">{id}</h3>
      {self && <p>(you)</p>}
      {dice && <DiceSet dice={dice} size="2xl" hidden={!self} />}
    </div>
  );
};

export default Game;
