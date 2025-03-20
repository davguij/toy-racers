import { Schema, MapSchema, type } from '@colyseus/schema';

/**
 * Represents a player in the race room
 */
export class Player extends Schema {
  @type('string') id: string;
  @type('string') name: string;
  @type('boolean') isReady: boolean;
  @type('string') carId: string;

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
  @type('string') status: 'waiting' | 'ready' | 'racing' | 'finished' = 'waiting';
}