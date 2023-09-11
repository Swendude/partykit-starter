import { useEffect, useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { stringToColor } from "@/utils";
import { Badge } from "./ui/badge";
import {
  Dice1,
  Dices,
  Square,
  User2,
  UserSquare,
  UserSquare2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

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

  // Indicated that the game is loading
  if (gameState === null) {
    return (
      <p className="m-4">
        <Dices className="inline transition-all animate-bounce" /> Waiting for
        server...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {gameState.currentUser === null ? (
        <>
          <Button size="sm" onClick={() => dispatch({ type: "startGame" })}>
            Game not started! Click to start
          </Button>
        </>
      ) : (
        <Card className="">
          <p>{`${gameState.currentUser}'s turn`}</p>
        </Card>
      )}
      <Separator />
      <h2 className="text-2xl">Your dice</h2>
      <div className="flex gap-4 justify-between">
        {gameState.userInfo[username]
          ? gameState.userInfo[username].dice?.map((d, i) => {
              if (d.status === "rolled") {
                return <p key={i}>{d.value}</p>;
              } else {
                return <p key={i}>?</p>;
              }
            })
          : [...new Array(5)].map((_, i) => (
              <Square key={i} className="stroke-muted" size={72} />
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
                  <h3>{user.id}</h3>
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
    </div>
  );
};

export default Game;
