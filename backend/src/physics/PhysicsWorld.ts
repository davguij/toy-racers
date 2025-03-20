import * as CANNON from 'cannon-es';

// Track constants - adjusted for toy car scale
const TRACK_LENGTH = 2.0; // 2 meters long (scaled down for toy size)
const TRACK_WIDTH = 0.15; // 15 cm wide (approx width of a Hot Wheels track)
const TRACK_SLOPE = Math.atan(0.15); // 15% slope in radians
const NUM_CHECKPOINTS = 2; // Start and finish only for simple track

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

    // Create plastic material for track
    const plasticMaterial = new CANNON.Material('plastic');
    const plasticContactMaterial = new CANNON.ContactMaterial(
      plasticMaterial,
      defaultMaterial,
      {
        friction: 0.1, // Low friction like plastic
        restitution: 0.4, // Slightly bouncy
      },
    );
    this.world.addContactMaterial(plasticContactMaterial);

    // Create the track and checkpoints
    this.track = this.createTrack(plasticMaterial);
    this.world.addBody(this.track);
    this.createCheckpoints();
  }

  /**
   * Create a simple straight plastic track with a slope
   */
  private createTrack(material: CANNON.Material): CANNON.Body {
    // Create a body for the track
    const trackBody = new CANNON.Body({
      mass: 0, // Static body (doesn't move)
      type: CANNON.Body.STATIC,
      material: material,
    });

    // Main track surface - a sloped plane
    const trackShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, 0.01, TRACK_WIDTH / 2),
    );

    // Position and rotate the track to create a slope
    trackBody.addShape(
      trackShape,
      new CANNON.Vec3(0, 0, 0),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0), // Rotate around X-axis for a track going down in Z direction
        -TRACK_SLOPE, // Negative angle for downhill slope
      ),
    );

    // Add small side barriers to prevent cars from falling off
    const barrierHeight = 0.03; // 3cm high barrier (scaled for toy cars)
    const barrierWidth = 0.01; // 1cm wide barrier

    // Left barrier
    const leftBarrierShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, barrierHeight / 2, barrierWidth / 2),
    );
    trackBody.addShape(
      leftBarrierShape,
      new CANNON.Vec3(
        0,
        barrierHeight / 2,
        -TRACK_WIDTH / 2 - barrierWidth / 2,
      ),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -TRACK_SLOPE,
      ),
    );

    // Right barrier
    const rightBarrierShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, barrierHeight / 2, barrierWidth / 2),
    );
    trackBody.addShape(
      rightBarrierShape,
      new CANNON.Vec3(0, barrierHeight / 2, TRACK_WIDTH / 2 + barrierWidth / 2),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -TRACK_SLOPE,
      ),
    );

    return trackBody;
  }

  /**
   * Create start and finish checkpoints for the track
   */
  private createCheckpoints(): void {
    // Create trigger bodies for start and finish line
    const checkpointShape = new CANNON.Box(
      new CANNON.Vec3(0.02, 0.05, TRACK_WIDTH / 2),
    );

    // Start checkpoint near the top of the track
    const startCheckpoint = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      isTrigger: true, // Allows bodies to pass through
    });
    startCheckpoint.addShape(checkpointShape);
    startCheckpoint.position.set(-TRACK_LENGTH / 2 + 0.2, 0.05, 0);
    startCheckpoint.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -TRACK_SLOPE,
    );
    this.world.addBody(startCheckpoint);
    this.checkpoints.push(startCheckpoint);

    // Finish checkpoint near the bottom of the track
    const finishCheckpoint = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      isTrigger: true,
    });
    finishCheckpoint.addShape(checkpointShape);
    finishCheckpoint.position.set(TRACK_LENGTH / 2 - 0.2, 0.05, 0);
    finishCheckpoint.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -TRACK_SLOPE,
    );
    this.world.addBody(finishCheckpoint);
    this.checkpoints.push(finishCheckpoint);
  }

  /**
   * Create a physics body for a car
   */
  createCarBody(
    carId: string,
    weight: number,
    dimensions: { length: number; width: number; height: number },
    friction: number,
    restitution: number,
  ): CANNON.Body {
    // Create a material for the car
    const carMaterial = new CANNON.Material(`car_${carId}`);
    const carContactMaterial = new CANNON.ContactMaterial(
      carMaterial,
      this.world.defaultMaterial,
      {
        friction,
        restitution,
      },
    );
    this.world.addContactMaterial(carContactMaterial);

    // Create the car body
    const carBody = new CANNON.Body({
      mass: weight / 1000, // Convert from grams to kg
      material: carMaterial,
    });

    // Add a box shape for the car
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        dimensions.length / 2,
        dimensions.height / 2,
        dimensions.width / 2,
      ),
    );
    carBody.addShape(shape);

    // Position the car at the start of the track, slightly elevated
    carBody.position.set(
      -TRACK_LENGTH / 2 + 0.1, // Near the start, adjusted for shorter track
      0.05, // Slightly above the track, adjusted for smaller size
      0, // Centered on the track
    );

    // Initial orientation pointed down the track
    carBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0), // Rotate around Y axis
      Math.PI / 2, // 90 degrees - point down the track
    );

    // Add the car to the world
    this.world.addBody(carBody);

    return carBody;
  }

  /**
   * Update the physics simulation by one timestep
   */
  update(): void {
    this.world.step(this.timeStep);
  }

  /**
   * Check if a car is off the track
   */
  isCarOffTrack(carBody: CANNON.Body): boolean {
    // Simple check: is the car too far to the sides or too far below/above the track?
    const pos = carBody.position;
    return (
      Math.abs(pos.z) > TRACK_WIDTH / 2 + 0.03 || // Too far to the sides, adjusted for narrower track
      pos.y < -0.5 || // Fallen off, reduced vertical threshold
      pos.x < -TRACK_LENGTH / 2 - 0.2 || // Too far back, adjusted for shorter track
      pos.x > TRACK_LENGTH / 2 + 0.2 // Too far forward, adjusted for shorter track
    );
  }

  /**
   * Check if a car has reached the finish line
   */
  isCarAtFinishLine(carBody: CANNON.Body): boolean {
    // Check if the car is beyond the finish line position
    return carBody.position.x > TRACK_LENGTH / 2 - 0.3;
  }

  /**
   * Get the checkpoint that the car has just passed
   * @returns -1 if no checkpoint passed, otherwise the index of the checkpoint
   */
  getPassedCheckpoint(carBody: CANNON.Body): number {
    // Simple implementation for now - just checks proximity to checkpoints
    for (let i = 0; i < this.checkpoints.length; i++) {
      const checkpoint = this.checkpoints[i];
      const distance = carBody.position.distanceTo(checkpoint.position);
      if (distance < 0.2) {
        // Reduced detection distance for smaller track
        return i;
      }
    }
    return -1;
  }

  /**
   * Apply a boost force to a car body
   */
  applyBoost(carBody: CANNON.Body, power: number): void {
    // Convert car's current orientation to a forward vector
    const forward = new CANNON.Vec3(0, 0, 1); // Forward is along Z axis
    carBody.vectorToWorldFrame(forward, forward); // Transform to world coordinates

    // Scale by power and apply as impulse
    forward.scale(power, forward);
    carBody.applyImpulse(forward, carBody.position);
  }

  /**
   * Get the current world instance
   */
  getWorld(): CANNON.World {
    return this.world;
  }
}
