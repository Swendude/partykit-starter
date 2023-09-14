import { useEffect, useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";

import { Dices, Square, User2 } from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";

import { ResetDialogButton } from "./reset-dialog";
import { LogView } from "./log-view";
import { LeaveDialogButton } from "./leave-dialog";
import { DiceSet } from "./diceset";

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

  return (
    <div className="flex flex-col gap-y-4 w-[500px]">
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
          <p>{`${gameState.currentUser}'s turn`}</p>
        </>
      )}

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
            <Card key={user.id} className="">
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
