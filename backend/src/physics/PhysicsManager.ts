import type { Car } from '@toy-racers/shared';
import type * as CANNON from 'cannon-es';
import type { Player, Transform } from '../game/state/RaceRoomState';
import { PhysicsWorld } from './PhysicsWorld';

/**
 * PhysicsManager coordinates between the physics simulation and the game state.
 * It manages car physics bodies, synchronizes physics with game state, and handles race events.
 */
export class PhysicsManager {
  private physicsWorld: PhysicsWorld;
  private carBodies: Map<string, CANNON.Body> = new Map();
  private activePlayers: Map<string, Player> = new Map();
  private isRaceStarted = false;
  private raceStartTime = 0;

  constructor() {
    this.physicsWorld = new PhysicsWorld();
  }

  /**
   * Initialize a player's car in the physics simulation
   */
  initializePlayerCar(playerId: string, car: Car, player: Player): void {
    // Create car physics body based on car attributes
    const carBody = this.physicsWorld.createCarBody(
      car.id,
      car.weight,
      car.dimensions,
      car.friction,
      car.restitution,
    );

    // Store the body in the map
    this.carBodies.set(playerId, carBody);
    this.activePlayers.set(playerId, player);

    // Position player 1 slightly to the left, player 2 slightly to the right
    if (this.carBodies.size === 1) {
      carBody.position.z = -1.5; // Left side
    } else {
      carBody.position.z = 1.5; // Right side
    }

    // Sync initial transform to player state
    this.syncBodyToTransform(carBody, player.transform);

    console.log(`🚗 Initialized car for player ${playerId} with car ${car.id}`);
  }

  /**
   * Start the race
   */
  startRace(): void {
    this.isRaceStarted = true;
    this.raceStartTime = Date.now();
    console.log('🏁 Race physics simulation started');
  }

  /**
   * Update the physics simulation
   */
  update(): { raceTime: number } {
    if (!this.isRaceStarted) {
      return { raceTime: 0 };
    }

    // Step the physics simulation
    this.physicsWorld.update();

    // Calculate current race time
    const currentTime = Date.now();
    const raceTime = currentTime - this.raceStartTime;

    // Update player transforms and check race conditions
    this.carBodies.forEach((body, playerId) => {
      const player = this.activePlayers.get(playerId);
      if (!player) return;

      // Skip if player already finished or is off track
      if (player.hasFinished || player.isOffTrack) return;

      // Sync physics body position to player transform
      this.syncBodyToTransform(body, player.transform);

      // Check if car is off track
      if (this.physicsWorld.isCarOffTrack(body)) {
        player.isOffTrack = true;
        player.finishTime = raceTime;
        console.log(`🚧 Player ${playerId} went off track at ${raceTime}ms`);
      }

      // Check if car crossed finish line
      if (this.physicsWorld.isCarAtFinishLine(body)) {
        player.hasFinished = true;
        player.finishTime = raceTime;
        console.log(`🏁 Player ${playerId} finished at ${raceTime}ms`);
      }
    });

    return { raceTime };
  }

  /**
   * Check if all cars have finished or gone off track
   */
  isRaceFinished(): boolean {
    if (!this.isRaceStarted) return false;

    // Race is finished if all players have either finished or gone off track
    return Array.from(this.activePlayers.values()).every(
      (player) => player.hasFinished || player.isOffTrack,
    );
  }

  /**
   * Sync a physics body state to a transform object
   */
  private syncBodyToTransform(body: CANNON.Body, transform: Transform): void {
    // Update position
    transform.x = body.position.x;
    transform.y = body.position.y;
    transform.z = body.position.z;

    // Update rotation (quaternion)
    transform.qx = body.quaternion.x;
    transform.qy = body.quaternion.y;
    transform.qz = body.quaternion.z;
    transform.qw = body.quaternion.w;
  }

  /**
   * Reset the physics simulation
   */
  reset(): void {
    this.isRaceStarted = false;
    this.raceStartTime = 0;
    this.carBodies.clear();
    this.activePlayers.clear();

    // Recreate the physics world
    this.physicsWorld = new PhysicsWorld();

    console.log('🔄 Physics simulation reset');
  }
}
