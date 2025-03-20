import { Room } from 'colyseus';
import type { Client } from 'colyseus';
import { RaceRoomState, Player } from '../state/RaceRoomState';

/**
 * RaceRoom handles the race session between two players.
 * For MVP - Step 2, it only handles players joining and leaving.
 */
export class RaceRoom extends Room<RaceRoomState> {
  // Maximum number of clients allowed in the room
  maxClients = 2;

  onCreate() {
    // Initialize room state
    this.setState(new RaceRoomState());

    console.log(`🏁 Race room created with id: ${this.roomId}`);
  }

  onJoin(client: Client) {
    // Add player to the room state
    this.state.players.set(
      client.sessionId,
      new Player(
        client.sessionId,
        `Player ${this.state.players.size + 1}`,
        false,
        ''
      )
    );

    console.log(`👨‍🏭 Player ${client.sessionId} joined the race room ${this.roomId}`);
    console.log(`🧮 Total players in room: ${this.state.players.size}`);
  }

  onLeave(client: Client) {
    // Remove player from room state
    this.state.players.delete(client.sessionId);

    console.log(`👋 Player ${client.sessionId} left the race room ${this.roomId}`);
    console.log(`🧮 Total players in room: ${this.state.players.size}`);

    // Auto-disconnect the room when empty for cleaner management
    if (this.state.players.size === 0) {
      console.log(`🏁 Race room ${this.roomId} is empty, will be disconnected`);
    }
  }

  onDispose() {
    console.log(`🗑️ Race room ${this.roomId} has been disposed`);
  }
}