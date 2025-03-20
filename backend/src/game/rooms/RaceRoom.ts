import { getCarById } from '@toy-racers/shared';
import { Room } from 'colyseus';
import type { Client } from 'colyseus';
import { PhysicsManager } from '../../physics/PhysicsManager';
import { Player, RaceRoomState } from '../state/RaceRoomState';

const PHYSICS_UPDATE_INTERVAL_MS = 16; // ~60Hz

/**
 * RaceRoom handles the race session between two players.
 * It includes advanced physics simulation for realistic racing.
 */
export class RaceRoom extends Room<RaceRoomState> {
  // Maximum number of clients allowed in the room
  maxClients = 2;

  // Physics manager to handle simulation
  private physicsManager: PhysicsManager = new PhysicsManager();

  // Timer for physics updates
  private physicsUpdateInterval: NodeJS.Timeout | null = null;

  onCreate() {
    // Initialize room state
    this.setState(new RaceRoomState());

    console.log(`🏁 Race room created with id: ${this.roomId}`);

    // Handle car selection message
    this.onMessage('select-car', (client, message: { carId: string }) => {
      this.handleCarSelection(client, message.carId);
    });

    // Handle ready status message
    this.onMessage('ready', (client) => {
      this.handlePlayerReady(client);
    });
  }

  onJoin(client: Client) {
    // Add player to the room state
    this.state.players.set(
      client.sessionId,
      new Player(
        client.sessionId,
        `Player ${this.state.players.size + 1}`,
        false,
        '',
      ),
    );

    console.log(
      `👨‍🏭 Player ${client.sessionId} joined the race room ${this.roomId}`,
    );
    console.log(`🧮 Total players in room: ${this.state.players.size}`);
  }

  onLeave(client: Client) {
    // Remove player from room state
    this.state.players.delete(client.sessionId);

    console.log(
      `👋 Player ${client.sessionId} left the race room ${this.roomId}`,
    );
    console.log(`🧮 Total players in room: ${this.state.players.size}`);

    // Auto-disconnect the room when empty for cleaner management
    if (this.state.players.size === 0) {
      console.log(`🏁 Race room ${this.roomId} is empty, will be disconnected`);
    }
  }

  onDispose() {
    // Clean up physics update timer
    if (this.physicsUpdateInterval) {
      clearInterval(this.physicsUpdateInterval);
      this.physicsUpdateInterval = null;
    }

    console.log(`🗑️ Race room ${this.roomId} has been disposed`);
  }

  /**
   * Handle car selection from a client
   */
  private handleCarSelection(client: Client, carId: string) {
    const player = this.state.players.get(client.sessionId);

    if (!player) {
      console.log(`⚠️ Player ${client.sessionId} not found in room`);
      return;
    }

    // Set the selected car ID
    player.carId = carId;
    console.log(`🚗 Player ${client.sessionId} selected car ${carId}`);

    // Check if we should transition to ready state
    this.checkTransitionToReady();
  }

  /**
   * Handle ready status from a client
   */
  private handlePlayerReady(client: Client) {
    const player = this.state.players.get(client.sessionId);

    if (!player) {
      console.log(`⚠️ Player ${client.sessionId} not found in room`);
      return;
    }

    // Mark player as ready
    player.isReady = true;
    console.log(`✅ Player ${client.sessionId} is ready`);

    // Check if we should start the race
    this.checkStartRace();
  }

  /**
   * Check if we should transition room to ready state
   */
  private checkTransitionToReady() {
    // If all players have selected a car, transition to ready state
    const allPlayersSelectedCar = Array.from(this.state.players.values()).every(
      (player) => player.carId !== '',
    );

    if (allPlayersSelectedCar && this.state.players.size === this.maxClients) {
      this.state.status = 'ready';
      console.log(`🟢 Race room ${this.roomId} is ready`);

      // Initialize car physics for each player
      this.initializeCarPhysics();
    }
  }

  /**
   * Initialize physics for all player cars
   */
  private initializeCarPhysics() {
    this.state.players.forEach((player, sessionId) => {
      const car = getCarById(player.carId);

      if (!car) {
        console.log(`⚠️ Car ${player.carId} not found for player ${sessionId}`);
        return;
      }

      // Initialize player's car in physics simulation
      this.physicsManager.initializePlayerCar(sessionId, car, player);
    });
  }

  /**
   * Check if we should start the race
   */
  private checkStartRace() {
    // If all players are ready, start the race
    const allPlayersReady = Array.from(this.state.players.values()).every(
      (player) => player.isReady,
    );

    if (allPlayersReady && this.state.status === 'ready') {
      this.startRace();
    }
  }

  /**
   * Start the race
   */
  private startRace() {
    // Set race state
    this.state.status = 'racing';
    this.state.raceStartTime = Date.now();
    console.log(`🏁 Race started in room ${this.roomId}`);

    // Start physics simulation
    this.physicsManager.startRace();

    // Start physics update loop
    this.physicsUpdateInterval = setInterval(() => {
      this.updatePhysics();
    }, PHYSICS_UPDATE_INTERVAL_MS);
  }

  /**
   * Update physics simulation
   */
  private updatePhysics() {
    // Update physics state
    const { raceTime } = this.physicsManager.update();

    // Update race time in state
    this.state.currentTime = raceTime;

    // Check if race is finished
    if (this.physicsManager.isRaceFinished()) {
      this.finishRace();
    }
  }

  /**
   * Finish the race
   */
  private finishRace() {
    // Clean up the physics update interval
    if (this.physicsUpdateInterval) {
      clearInterval(this.physicsUpdateInterval);
      this.physicsUpdateInterval = null;
    }

    // Set race state to finished
    this.state.status = 'finished';
    console.log(`🏁 Race finished in room ${this.roomId}`);

    // Broadcast race results
    this.broadcast('race-finished', {
      players: Array.from(this.state.players.entries()).map(([id, player]) => ({
        id,
        name: player.name,
        carId: player.carId,
        hasFinished: player.hasFinished,
        isOffTrack: player.isOffTrack,
        finishTime: player.finishTime,
      })),
    });
  }
}
