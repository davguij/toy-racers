import * as CANNON from 'cannon-es';

// Track constants
const TRACK_LENGTH = 20;
const TRACK_WIDTH = 6;
const TRACK_SLOPE = 15 * (Math.PI / 180); // 15 degrees in radians
const NUM_CHECKPOINTS = 4;

/**
 * PhysicsWorld manages the physics simulation for the race.
 * It handles the creation and updating of physics bodies, forces, and collisions.
 */
export class PhysicsWorld {
  // The main physics world instance
  private world: CANNON.World;

  // Physics bodies for track elements
  private track: CANNON.Body;
  private checkpoints: CANNON.Body[] = [];

  // Fixed timestep for physics simulation (60 Hz)
  private readonly timeStep = 1 / 60;

  constructor() {
    // Initialize the physics world with gravity
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0), // Standard gravity, pointing down on Y-axis
    });

    // Set default material properties
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.3,
        restitution: 0.2, // Slight bounce
      },
    );
    this.world.addContactMaterial(defaultContactMaterial);
    this.world.defaultContactMaterial = defaultContactMaterial;

    // Create the track and checkpoints
    this.track = this.createTrack();
    this.world.addBody(this.track);
    this.createCheckpoints();
  }

  /**
   * Create the race track with a sloped surface and small walls
   */
  private createTrack(): CANNON.Body {
    // Create a compound body for the track
    const trackBody = new CANNON.Body({
      mass: 0, // Static body (doesn't move)
      type: CANNON.Body.STATIC,
    });

    // Main track surface - a sloped plane
    // Create the main track surface
    const trackShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, 0.1, TRACK_WIDTH / 2),
    );

    // Position and rotate the track to create a slope
    trackBody.addShape(
      trackShape,
      new CANNON.Vec3(0, 0, 0),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(0, 0, 1), // Rotate around Z-axis
        -TRACK_SLOPE, // Negative angle for downhill slope
      ),
    );

    // Left wall
    const leftWallShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, 0.5, 0.1),
    );
    trackBody.addShape(
      leftWallShape,
      new CANNON.Vec3(0, 0.4, -TRACK_WIDTH / 2),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(0, 0, 1),
        -TRACK_SLOPE,
      ),
    );

    // Right wall
    const rightWallShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, 0.5, 0.1),
    );
    trackBody.addShape(
      rightWallShape,
      new CANNON.Vec3(0, 0.4, TRACK_WIDTH / 2),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(0, 0, 1),
        -TRACK_SLOPE,
      ),
    );

    // Bottom wall (finish line area)
    const bottomWallShape = new CANNON.Box(
      new CANNON.Vec3(0.1, 0.5, TRACK_WIDTH / 2),
    );
    // Position at the bottom of the track
    const bottomPos = new CANNON.Vec3(
      (-TRACK_LENGTH / 2) * Math.cos(TRACK_SLOPE),
      (TRACK_LENGTH / 2) * Math.sin(TRACK_SLOPE),
      0,
    );
    trackBody.addShape(bottomWallShape, bottomPos);

    return trackBody;
  }

  /**
   * Create checkpoint triggers along the track
   */
  private createCheckpoints(): void {
    // Create checkpoints evenly spaced along the track
    for (let i = 0; i < NUM_CHECKPOINTS; i++) {
      const progress = (i + 1) / (NUM_CHECKPOINTS + 1); // +1 to leave space at start/finish
      const checkpointBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        isTrigger: true, // Make it a trigger volume
      });

      // Create a thin box for the checkpoint
      const checkpointShape = new CANNON.Box(
        new CANNON.Vec3(0.1, 0.5, TRACK_WIDTH / 2),
      );
      checkpointBody.addShape(checkpointShape);

      // Position along the track
      const x = (TRACK_LENGTH / 2) * (1 - 2 * progress) * Math.cos(TRACK_SLOPE);
      const y =
        (TRACK_LENGTH / 2) * (1 - 2 * progress) * Math.sin(TRACK_SLOPE) + 0.5;
      checkpointBody.position.set(x, y, 0);

      this.world.addBody(checkpointBody);
      this.checkpoints.push(checkpointBody);
    }
  }

  /**
   * Create a car physics body based on car attributes
   */
  createCarBody(
    carId: string,
    weight: number,
    dimensions: { length: number; width: number; height: number },
    friction: number,
    restitution: number,
  ): CANNON.Body {
    // Create a physics body for the car
    const massInKg = weight / 1000; // Convert grams to kg
    console.log(`🚗 Creating car body for ${carId}:`, {
      massInKg,
      dimensions,
      friction,
      restitution,
    });

    // Create car material with specified properties
    const carMaterial = new CANNON.Material('car');

    const carBody = new CANNON.Body({
      mass: massInKg,
      material: carMaterial,
    });

    // Set car shape as a box based on dimensions (in meters)
    const carShape = new CANNON.Box(
      new CANNON.Vec3(
        dimensions.length / 2,
        dimensions.height / 2,
        dimensions.width / 2,
      ),
    );
    carBody.addShape(carShape);

    // Create contact material for car-track interaction
    const carContactMaterial = new CANNON.ContactMaterial(
      carMaterial,
      this.world.defaultMaterial,
      {
        friction,
        restitution,
      },
    );
    this.world.addContactMaterial(carContactMaterial);

    // Start position at the top of the track
    const startX = (TRACK_LENGTH / 2) * Math.cos(TRACK_SLOPE);
    const startY =
      (TRACK_LENGTH / 2) * Math.sin(TRACK_SLOPE) + dimensions.height;
    carBody.position.set(
      startX, // X position (top of slope)
      startY, // Y position (accounting for car height)
      0, // Z position (center of track width)
    );

    console.log(`🚗 Car ${carId} initial position:`, {
      x: carBody.position.x,
      y: carBody.position.y,
      z: carBody.position.z,
      slope: TRACK_SLOPE * (180 / Math.PI), // Convert to degrees for logging
    });

    // Set initial orientation
    carBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -TRACK_SLOPE);

    // Log initial velocity and forces
    console.log(`🚗 Car ${carId} initial state:`, {
      velocity: carBody.velocity,
      force: carBody.force,
      material: carBody.material?.name || 'unknown',
    });

    // Add to the world
    this.world.addBody(carBody);

    return carBody;
  }

  /**
   * Step the physics simulation forward
   */
  update(): void {
    this.world.step(this.timeStep);
  }

  /**
   * Check if a car is off the track
   */
  isCarOffTrack(carBody: CANNON.Body): boolean {
    // If car is more than half track width away from center, it's off track
    return Math.abs(carBody.position.z) > TRACK_WIDTH / 2;
  }

  /**
   * Check if a car has crossed the finish line
   */
  isCarAtFinishLine(carBody: CANNON.Body): boolean {
    // The finish line is at the bottom of the track (negative x)
    const finishLineX = (-TRACK_LENGTH / 2) * Math.cos(TRACK_SLOPE);

    // Car has crossed if its x position is less than the finish line position
    return carBody.position.x < finishLineX;
  }

  /**
   * Check if a car has passed a specific checkpoint
   */
  getPassedCheckpoint(carBody: CANNON.Body): number {
    for (let i = 0; i < this.checkpoints.length; i++) {
      const checkpoint = this.checkpoints[i];
      const distance = carBody.position.distanceTo(checkpoint.position);

      // If car is close enough to checkpoint, consider it passed
      if (distance < 1.0) {
        return i;
      }
    }
    return -1;
  }
}
