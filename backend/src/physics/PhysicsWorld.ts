import * as CANNON from 'cannon-es';

// Track constants - adjusted for toy car scale
const TRACK_LENGTH = 10.0; // Keep the longer track for a 15s race time
const TRACK_WIDTH = 0.3; // Wider track for better stability
const TRACK_SLOPE = Math.atan(0.3); // Increased to ~16.7 degrees - steeper slope to provide enough gravity force
const NUM_CHECKPOINTS = 2; // Start and finish line

// Debug configuration flag
const DEBUG_PHYSICS = true;

console.log('🏎️ Track dimensions:', {
  length: TRACK_LENGTH,
  width: TRACK_WIDTH,
  slope: TRACK_SLOPE,
  slopeDegrees: (TRACK_SLOPE * 180) / Math.PI,
  checkpoints: NUM_CHECKPOINTS,
});

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

  // Store materials for later use
  private materials: { default: CANNON.Material; plastic: CANNON.Material };

  constructor() {
    // Create physics world with realistic gravity for toy cars
    this.world = new CANNON.World();

    // Set gravity along direction of the track for better downhill movement
    // This creates a gravity component along the track direction
    const gravityStrength = 9.82 * 1.5; // Enhanced gravity for better movement
    const gravityX = Math.sin(TRACK_SLOPE) * gravityStrength; // Gravity component along track (X-axis)
    const gravityY = -Math.cos(TRACK_SLOPE) * gravityStrength; // Gravity component perpendicular to track (Y-axis)

    this.world.gravity.set(gravityX, gravityY, 0);

    if (DEBUG_PHYSICS) {
      console.log('🌍 Gravity components:', {
        x: gravityX,
        y: gravityY,
        strength: gravityStrength,
        explanation:
          'Gravity is aligned with track slope for better downhill movement',
      });
    }

    // Create materials with better traction
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1, // Very low friction to allow gravity to move cars easily
        restitution: 0.01, // Almost no bounce to prevent cars from jumping
        contactEquationStiffness: 1e6, // Lower stiffness for smoother contacts
        contactEquationRelaxation: 5, // Higher relaxation for better stability
        frictionEquationStiffness: 1e6, // Lower stiffness for smoother friction
        frictionEquationRelaxation: 5, // Higher relaxation for better stability
      },
    );

    // Create plastic material with better properties
    const plasticMaterial = new CANNON.Material('plastic');
    const plasticContactMaterial = new CANNON.ContactMaterial(
      plasticMaterial,
      defaultMaterial,
      {
        friction: 0.05, // Very low friction for track surface
        restitution: 0.01, // Almost no bounce
        contactEquationStiffness: 1e6,
        contactEquationRelaxation: 5,
        frictionEquationStiffness: 1e6,
        frictionEquationRelaxation: 5,
      },
    );

    // Add contact materials to the world
    this.world.addContactMaterial(defaultContactMaterial);
    this.world.addContactMaterial(plasticContactMaterial);
    this.world.defaultContactMaterial = defaultContactMaterial;

    // Enable broadphase for better collision detection
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);

    // Additional physics world settings
    this.world.allowSleep = false; // Don't allow bodies to sleep for continuous movement

    // Store materials for later use
    this.materials = {
      default: defaultMaterial,
      plastic: plasticMaterial,
    };

    // Create the track and checkpoints
    this.track = this.createTrack(plasticMaterial);
    this.world.addBody(this.track);
    this.createCheckpoints();
  }

  /**
   * Create a simple straight plastic track with a slope
   */
  private createTrack(material: CANNON.Material): CANNON.Body {
    const trackBody = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      material: material,
    });

    const trackShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, 0.01, TRACK_WIDTH / 2),
    );
    trackBody.addShape(trackShape);

    // Rotate the track to simulate the slope
    const rotationQuaternion = new CANNON.Quaternion();
    rotationQuaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -TRACK_SLOPE);
    trackBody.quaternion.copy(rotationQuaternion);

    // Add barriers (positions will rotate with the track body)
    const barrierHeight = 0.06;
    const barrierWidth = 0.02;

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
    );

    const rightBarrierShape = new CANNON.Box(
      new CANNON.Vec3(TRACK_LENGTH / 2, barrierHeight / 2, barrierWidth / 2),
    );
    trackBody.addShape(
      rightBarrierShape,
      new CANNON.Vec3(0, barrierHeight / 2, TRACK_WIDTH / 2 + barrierWidth / 2),
    );

    if (DEBUG_PHYSICS) {
      console.log('🛤️ Track created with properties:', {
        length: TRACK_LENGTH,
        width: TRACK_WIDTH,
        barrierHeight,
        material: material.name,
        slopeDegrees: (TRACK_SLOPE * 180) / Math.PI,
      });
    }

    return trackBody;
  }

  /**
   * Create start and finish checkpoints for the track
   */
  private createCheckpoints(): void {
    const checkpointShape = new CANNON.Box(
      new CANNON.Vec3(0.02, 0.05, TRACK_WIDTH / 2),
    );
    const sinTheta = Math.sin(TRACK_SLOPE);

    // Start checkpoint
    const startX = -TRACK_LENGTH / 2 + 0.2; // -4.8
    const startTrackY = -startX * sinTheta + 0.005; // Track surface y at x
    const startCheckpoint = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      isTrigger: true,
    });
    startCheckpoint.addShape(checkpointShape);
    startCheckpoint.position.set(startX, startTrackY + 0.05, 0);
    this.world.addBody(startCheckpoint);
    this.checkpoints.push(startCheckpoint);

    console.log('🏁 Start checkpoint position:', {
      x: startCheckpoint.position.x,
      y: startCheckpoint.position.y,
      z: startCheckpoint.position.z,
    });

    // Finish checkpoint
    const finishX = TRACK_LENGTH / 2 - 0.2; // 4.8
    const finishTrackY = -finishX * sinTheta + 0.005;
    const finishCheckpoint = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
      isTrigger: true,
    });
    finishCheckpoint.addShape(checkpointShape);
    finishCheckpoint.position.set(finishX, finishTrackY + 0.05, 0);
    this.world.addBody(finishCheckpoint);
    this.checkpoints.push(finishCheckpoint);

    console.log('🏁 Finish checkpoint position:', {
      x: finishCheckpoint.position.x,
      y: finishCheckpoint.position.y,
      z: finishCheckpoint.position.z,
    });
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
    const carMaterial = new CANNON.Material(`car_${carId}`);
    const carContactMaterial = new CANNON.ContactMaterial(
      carMaterial,
      this.world.defaultMaterial,
      {
        friction: friction, // e.g., 0.7, adjust to 0.1 if too high
        restitution: restitution,
      },
    );
    this.world.addContactMaterial(carContactMaterial);

    const carBody = new CANNON.Body({
      mass: weight / 500,
      material: carMaterial,
      angularDamping: 0.9,
      linearDamping: 0.01,
    });

    const shape = new CANNON.Box(
      new CANNON.Vec3(
        dimensions.length / 2,
        dimensions.height / 2,
        dimensions.width / 2,
      ),
    );
    carBody.addShape(shape);

    // Position on sloped track
    const x = -TRACK_LENGTH / 2 + 0.5; // -4.5
    const trackY = -x * Math.sin(TRACK_SLOPE) + 0.005;
    const carY = trackY + dimensions.height / 2;
    carBody.position.set(x, carY, 0);

    carBody.allowSleep = false;
    carBody.sleepSpeedLimit = 0.1;
    carBody.sleepTimeLimit = 1;
    carBody.collisionFilterGroup = 1;
    carBody.collisionFilterMask = 1;
    carBody.collisionResponse = true;

    this.world.addBody(carBody);

    if (DEBUG_PHYSICS) {
      console.log(`🚗 Car ${carId} created with properties:`, {
        dimensions,
        position: carBody.position,
        mass: carBody.mass,
        material: carBody.material?.name,
        friction: 0.03,
        restitution: 0.01,
      });
    }

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
    const pos = carBody.position;
    const TRACK_SLOPE = 0.2914567944778671; // From logs, in radians

    // Calculate the track's height at the car's x-position
    const trackHeight = -pos.x * Math.sin(TRACK_SLOPE);

    // Define a tolerance for how far above or below the track the car can be
    const heightTolerance = 0.1; // e.g., 10 cm leeway
    const isOffHeight =
      pos.y < trackHeight - heightTolerance ||
      pos.y > trackHeight + heightTolerance;

    // Lateral and longitudinal checks remain unchanged
    const TRACK_WIDTH = 0.3;
    const TRACK_LENGTH = 10;
    const isOffLateral = Math.abs(pos.z) > TRACK_WIDTH / 2 + 0.05;
    const isOffLongitudinal =
      pos.x < -TRACK_LENGTH / 2 - 0.5 || pos.x > TRACK_LENGTH / 2 + 0.5;

    const offTrack = isOffLateral || isOffHeight || isOffLongitudinal;

    // Log for debugging
    if (offTrack) {
      console.log('🚧 Car off track at position:', {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        trackHeight,
        heightTolerance,
        isOffHeight,
        isOffLateral,
        isOffLongitudinal,
      });
    }

    return offTrack;
  }
  /**
   * Check if a car has reached the finish line
   */
  isCarAtFinishLine(carBody: CANNON.Body): boolean {
    // Check if the car is beyond the finish line position
    const isAtFinish = carBody.position.x > TRACK_LENGTH / 2 - 0.3;
    if (isAtFinish) {
      console.log('🏁 Car reached finish line at position:', {
        x: carBody.position.x,
        y: carBody.position.y,
        z: carBody.position.z,
        finishThreshold: TRACK_LENGTH / 2 - 0.3,
      });
    }
    return isAtFinish;
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
      if (distance < 0.5) {
        // Keep 0.5 for checkpoint detection
        return i;
      }
    }
    return -1;
  }

  /**
   * Apply a boost force to a car body - only used for initial nudge
   */
  applyBoost(carBody: CANNON.Body, power: number): void {
    // Apply a small impulse in the direction of the track
    // For gravity racing, this is mainly to overcome initial static friction
    const direction = new CANNON.Vec3(1, 0, 0); // Forward along the track (X-axis)

    // Scale by power and mass
    const impulse = direction.scale(power * carBody.mass * 5); // Increased scale factor

    // Apply impulse at center of mass
    carBody.applyImpulse(impulse, carBody.position);

    if (DEBUG_PHYSICS) {
      console.log('🚀 Applied initial impulse:', {
        direction: { x: direction.x, y: direction.y, z: direction.z },
        magnitude: power * carBody.mass * 5,
        position: {
          x: carBody.position.x,
          y: carBody.position.y,
          z: carBody.position.z,
        },
      });
    }
  }

  /**
   * Get the current world instance
   */
  getWorld(): CANNON.World {
    return this.world;
  }
}
