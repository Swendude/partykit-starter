import type * as Party from "partykit/server";

import { gameUpdater, initialGame, Action, ServerAction } from "../game/logic";
import { GameState } from "../game/logic";

interface ServerMessage {
  state: GameState;
}

export default class Server implements Party.Server {
  private gameState: GameState;

  constructor(readonly party: Party.Party) {
    this.gameState = initialGame();
    console.log("Room created:", party.id);
    console.log("Room target", this.gameState.target);
  }

  onConnect(connection: Party.Connection) {
    // A websocket just connected!

    // let's send a message to the connection
    // conn.send();
    console.log(`connect:`, connection.id);
    this.gameState = gameUpdater(
      { type: "UserEntered", user: { id: connection.id } },
      this.gameState
    );
    this.party.broadcast(JSON.stringify(this.gameState));
  }
  onClose(connection: Party.Connection) {
    this.gameState = gameUpdater(
      {
        type: "UserExit",
        user: { id: connection.id },
      },
      this.gameState
    );
    this.party.broadcast(JSON.stringify(this.gameState));
  }
  onMessage(message: string, sender: Party.Connection) {
    const action: ServerAction = {
      ...(JSON.parse(message) as Action),
      user: { id: sender.id },
    };
    console.log(`Received action ${action.type} from user ${sender.id}`);
    this.gameState = gameUpdater(action, this.gameState);
    this.party.broadcast(JSON.stringify(this.gameState));
  }
}

Server satisfies Party.Worker;
