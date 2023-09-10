import type {
  Party,
  PartyConnection,
  PartyConnectionContext,
  PartyServer,
  PartyWorker,
} from "partykit/server";

import { gameUpdater, initialGame, Action, ServerAction } from "../game/logic";
import { GameState } from "../game/logic";

interface ServerMessage {
  state: GameState;
}

export default class Server implements PartyServer {
  private gameState: GameState;

  constructor(readonly party: Party) {
    this.gameState = initialGame();
    console.log("Room created:", party.id);
    console.log("Room target", this.gameState.target);
    // party.storage.put;
  }
  onConnect(connection: PartyConnection, ctx: PartyConnectionContext) {
    // A websocket just connected!

    // let's send a message to the connection
    // conn.send();
    this.gameState = gameUpdater(
      { type: "UserEntered", user: { id: connection.id } },
      this.gameState
    );
    this.party.broadcast(JSON.stringify(this.gameState));
  }
  onClose(connection: PartyConnection) {
    this.gameState = gameUpdater(
      {
        type: "UserExit",
        user: { id: connection.id },
      },
      this.gameState
    );
    this.party.broadcast(JSON.stringify(this.gameState));
  }
  onMessage(message: string, sender: PartyConnection) {
    const action: ServerAction = {
      ...(JSON.parse(message) as Action),
      user: { id: sender.id },
    };
    console.log(`Received action ${action.type} from user ${sender.id}`);
    this.gameState = gameUpdater(action, this.gameState);
    this.party.broadcast(JSON.stringify(this.gameState));
  }
}

Server satisfies PartyWorker;
