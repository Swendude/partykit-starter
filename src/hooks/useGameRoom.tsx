import usePartySocket from "partysocket/react";
import { useState } from "react";
import { GameState, Action } from "../../game/logic";

export const useGameRoom = (username: string, roomId: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_SERVER_URL || "127.0.0.1:1999",
    room: roomId,
    id: username,
    onMessage(event: MessageEvent<string>) {
      setGameState(JSON.parse(event.data));
    },
  });

  const dispatch = (action: Action) => {
    socket.send(JSON.stringify(action));
  };

  return {
    gameState,
    dispatch,
  };
};
