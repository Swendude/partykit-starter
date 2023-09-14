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
    <div className="flex flex-col gap-y-4">
      {gameState.currentUser === null ? (
        <>
          <Button
            className="w-fit"
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
      <div className="flex gap-4 justify-between">
        {gameState.userInfo[username] &&
        gameState.userInfo[username].dice !== null
          ? gameState.userInfo[username].dice?.map((d, i) => {
              if (d.status === "rolled") {
                return <p key={i}>{d.value}</p>;
              } else {
                return <p key={i}>?</p>;
              }
            })
          : [...new Array(5)].map((_, i) => (
              <Square key={i} className="stroke-accent" size={72} />
            ))}
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
                <CardContent className="flex gap-2 p-0">
                  {[...new Array(5)].map((_, i) => (
                    <Square key={i} className="stroke-muted" size={32} />
                  ))}
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
