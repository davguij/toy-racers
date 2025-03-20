import * as CANNON from 'cannon-es';

/**
 * PhysicsWorld manages the physics simulation for the race.
 * It handles the creation and updating of physics bodies, forces, and collisions.
 */
export class PhysicsWorld {
  // The main physics world instance
  private world: CANNON.World;

  // Physics bodies for track elements
  private track: CANNON.Body;

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

    // Create the track
    this.track = this.createTrack();
    this.world.addBody(this.track);
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
    // 20m long, 6m wide, sloped at 15 degrees
    const trackLength = 20;
    const trackWidth = 6;
    const trackSlope = 15 * (Math.PI / 180); // Convert to radians

    // Create the main track surface
    const trackShape = new CANNON.Box(
      new CANNON.Vec3(trackLength / 2, 0.1, trackWidth / 2),
    );

    // Position and rotate the track to create a slope
    trackBody.addShape(
      trackShape,
      new CANNON.Vec3(0, 0, 0),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(0, 0, 1), // Rotate around Z-axis
        -trackSlope, // Negative angle for downhill slope
      ),
    );

    // Left wall
    const leftWallShape = new CANNON.Box(
      new CANNON.Vec3(trackLength / 2, 0.5, 0.1),
    );
    trackBody.addShape(
      leftWallShape,
      new CANNON.Vec3(0, 0.4, -trackWidth / 2),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(0, 0, 1),
        -trackSlope,
      ),
    );

    // Right wall
    const rightWallShape = new CANNON.Box(
      new CANNON.Vec3(trackLength / 2, 0.5, 0.1),
    );
    trackBody.addShape(
      rightWallShape,
      new CANNON.Vec3(0, 0.4, trackWidth / 2),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(0, 0, 1),
        -trackSlope,
      ),
    );

    // Bottom wall (finish line area)
    const bottomWallShape = new CANNON.Box(
      new CANNON.Vec3(0.1, 0.5, trackWidth / 2),
    );
    // Position at the bottom of the track
    const bottomPos = new CANNON.Vec3(
      (-trackLength / 2) * Math.cos(trackSlope),
      (trackLength / 2) * Math.sin(trackSlope),
      0,
    );
    trackBody.addShape(bottomWallShape, bottomPos);

    return trackBody;
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
    const carBody = new CANNON.Body({
      mass: weight / 1000, // Convert grams to kg
      material: new CANNON.Material('car'),
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

    // Create contact material for this car
    const carContactMaterial = new CANNON.ContactMaterial(
      carBody.material as CANNON.Material,
      this.world.defaultMaterial,
      {
        friction,
        restitution,
      },
    );
    this.world.addContactMaterial(carContactMaterial);

    // Position the car at the starting position on the track
    const trackLength = 20;
    const trackWidth = 6;
    const trackSlope = 15 * (Math.PI / 180);

    // Start position at the top of the track
    carBody.position.set(
      (trackLength / 2) * Math.cos(trackSlope), // X position (top of slope)
      (trackLength / 2) * Math.sin(trackSlope) + 0.5, // Y position (elevated)
      0, // Z position (center of track width)
    );

    // Set initial orientation
    carBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -trackSlope);

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
    // Track width is 6m, so if car is more than 3m away from center, it's off track
    return Math.abs(carBody.position.z) > 3;
  }

  /**
   * Check if a car has crossed the finish line
   */
  isCarAtFinishLine(carBody: CANNON.Body): boolean {
    // The finish line is at the bottom of the track (negative x)
    const trackLength = 20;
    const trackSlope = 15 * (Math.PI / 180);
    const finishLineX = (-trackLength / 2) * Math.cos(trackSlope);

    // Car has crossed if its x position is less than the finish line position
    return carBody.position.x < finishLineX;
  }
}
