import { MapSchema, Schema, type } from '@colyseus/schema';

/**
 * Represents a position and orientation in 3D space
 * Used to synchronize physics state between server and client
 */
export class Transform extends Schema {
  // Position
  @type('number') x = 0;
  @type('number') y = 0;
  @type('number') z = 0;

  // Rotation (quaternion)
  @type('number') qx = 0;
  @type('number') qy = 0;
  @type('number') qz = 0;
  @type('number') qw = 1; // Default identity quaternion
}

/**
 * Represents a player in the race room
 */
export class Player extends Schema {
  @type('string') id: string;
  @type('string') name: string;
  @type('boolean') isReady: boolean;
  @type('string') carId: string;

  // Physics transform for the player's car
  @type(Transform) transform = new Transform();

  // Race status
  @type('boolean') isOffTrack = false;
  @type('boolean') hasFinished = false;
  @type('number') finishTime = 0;

  constructor(id = '', name = '', isReady = false, carId = '') {
    super();
    this.id = id;
    this.name = name;
    this.isReady = isReady;
    this.carId = carId;
  }
}

/**
 * Represents the state of a race room
 */
export class RaceRoomState extends Schema {
  // Map of players in the room, keyed by session ID
  @type({ map: Player }) players = new MapSchema<Player>();

  // Room status
  @type('string') status: 'waiting' | 'ready' | 'racing' | 'finished' =
    'waiting';

  // Race information
  @type('number') raceStartTime = 0;
  @type('number') currentTime = 0;
}
