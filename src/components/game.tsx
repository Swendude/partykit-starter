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
import { BetForm } from "./bet-form";

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

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

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
            <p
              className={cn(
                "h-10 px-4 py-2 text-2xl",
                usersTurn && "animate-bounce"
              )}
            >
              {`${usersTurn ? "Your" : `${gameState.currentUser}'s`} turn`}
            </p>

            {gameState.currentBet ? (
              <div>
                <p>
                  The current bet is: {gameState.currentBet.amount} *{" "}
                  {gameState.currentBet.face}
                </p>
                <p>Made by: {gameState.currentBet.userId}</p>
              </div>
            ) : (
              <div className="pt-2">No bet yet</div>
            )}

            <BetForm active={usersTurn} />
          </>
        )}

        {usersTurn ? <div></div> : <div></div>}
      </div>

      <LogView logs={gameState.log} />

      <Separator />

      <h2 className="text-2xl">Your dice</h2>
      <div>
        <DiceSet dice={gameState.userInfo[username].dice} />
      </div>

      <Separator />

      <h2 className="text-2xl">Opponent dice</h2>
      <div className="grid grid-cols-2 gap-2 ">
        {gameState.users
          .filter((user) => user.id !== username)
          .map((user) => (
            <Card
              key={user.id}
              className={cn(
                user.id === gameState.currentUser && "border-white"
              )}
            >
              <CardHeader>
                <CardTitle className="flex gap-2 items-end">
                  <User2 className="inline-block text-end" size={32} />
                  {user.id}
                </CardTitle>
                <Separator />
                <CardContent className="p-0">
                  <DiceSet
                    dice={gameState.userInfo[user.id].dice}
                    variant="sm"
                    hidden
                  />
                </CardContent>
              </CardHeader>
            </Card>
          ))}
      </div>

      <Separator />

      <div className="flex justify-between">
        <ResetDialogButton onConfirm={() => dispatch({ type: "resetGame" })} />
        <LeaveDialogButton onConfirm={leaveRoom} />
      </div>
    </div>
  );
};

export default Game;
