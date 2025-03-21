import { getCarById } from '@toy-racers/shared';
import { Room } from 'colyseus';
import type { Client } from 'colyseus';
import { PhysicsManager } from '../../physics/PhysicsManager';
import { Player, RaceRoomState } from '../state/RaceRoomState';

// Types for physics state
interface CarState {
  position: { x: number; y: number; z: number };
  speed: number;
  checkpointsPassed: number;
}

interface PhysicsUpdateResult {
  raceTime: number;
  carStates: Map<string, CarState>;
}

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

  // Last time we logged race state
  private lastLogTime = 0;

  // Minimum time between logs in milliseconds
  private readonly LOG_THROTTLE_MS = 1000;

  /**
   * Helper method to check if we should log based on throttle time
   */
  private shouldLog(): boolean {
    const now = Date.now();
    if (now - this.lastLogTime >= this.LOG_THROTTLE_MS) {
      this.lastLogTime = now;
      return true;
    }
    return false;
  }

  /**
   * Helper method for throttled logging
   */
  private throttledLog(logFn: () => void) {
    if (this.shouldLog()) {
      logFn();
    }
  }

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

    console.log(`🔍 Handling player ready:
      - Player ID: ${client.sessionId}
      - Player found: ${!!player}
      - Current status: ${this.state.status}
      - Total players: ${this.state.players.size}
      - Player states:
        ${Array.from(this.state.players.entries())
          .map(([id, p]) => `${id}: ready=${p.isReady}, carId=${p.carId}`)
          .join('\n        ')}`);

    if (!player) {
      console.log(`⚠️ Player ${client.sessionId} not found in room`);
      return;
    }

    // Verify player has selected a car before allowing ready
    if (!player.carId) {
      console.log(
        `⚠️ Player ${client.sessionId} tried to ready without selecting a car`,
      );
      return;
    }

    // Mark player as ready
    player.isReady = true;
    console.log(`✅ Player ${client.sessionId} is ready`);

    // Check if all players are ready and have selected cars
    const allPlayersReady = Array.from(this.state.players.values()).every(
      (p) => p.isReady && p.carId !== '',
    );

    console.log(`🔍 Race start check:
      - All players ready: ${allPlayersReady}
      - Room status: ${this.state.status}
      - Total players: ${this.state.players.size}
      - Max clients: ${this.maxClients}`);

    // Start race if all players are ready and we have max players
    if (
      allPlayersReady &&
      this.state.players.size === this.maxClients &&
      this.state.status === 'ready'
    ) {
      console.log('🎯 All conditions met for race start, initiating race...');
      this.startRace();
    } else {
      console.log('⏳ Waiting for other players or room not ready');
    }
  }

  /**
   * Check if we should transition room to ready state
   */
  private checkTransitionToReady() {
    // If all players have selected a car, transition to ready state
    const allPlayersSelectedCar = Array.from(this.state.players.values()).every(
      (player) => player.carId !== '',
    );

    console.log(`🔍 Checking transition to ready:
      - Total players: ${this.state.players.size}
      - Max clients: ${this.maxClients}
      - All players selected car: ${allPlayersSelectedCar}
      - Current status: ${this.state.status}
      - Players state:
        ${Array.from(this.state.players.entries())
          .map(
            ([id, player]) =>
              `${id}: carId=${player.carId}, ready=${player.isReady}`,
          )
          .join('\n        ')}`);

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
    const { raceTime, carStates } =
      this.physicsManager.update() as PhysicsUpdateResult;

    // Update race time in state
    this.state.currentTime = raceTime;

    // Throttle race progress logs to once per second
    this.throttledLog(() => {
      console.log(`🏎️ Race progress at ${Math.floor(raceTime / 1000)}s:`);
      carStates.forEach((state: CarState, playerId: string) => {
        const player = this.state.players.get(playerId);
        if (!state || !player) {
          console.log(`  - ${playerId}: No state available`);
          return;
        }

        if (player.hasFinished) {
          console.log(`  - ${playerId}: Finished`);
        } else if (player.isOffTrack) {
          console.log(`  - ${playerId}: Off track`);
        } else {
          // Convert speed to km/h (state.speed is in m/s)
          const speedKmh = state.speed * 3.6;

          console.log(
            `  - ${playerId}: CP${state.checkpointsPassed} | ` +
              `Pos(${state.position?.x?.toFixed(2) ?? '?'}, ${state.position?.z?.toFixed(2) ?? '?'}) | ` +
              `${speedKmh.toFixed(1)} km/h`,
          );
        }
      });
    });

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

    // Log final race results
    console.log(
      `📊 Final results:${Array.from(this.state.players.entries())
        .map(
          ([id, player]) => `
      ${id}: ${player.hasFinished ? `Finished in ${player.finishTime}ms` : player.isOffTrack ? 'Off track' : 'DNF'}`,
        )
        .join('')}`,
    );

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
