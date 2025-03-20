# Progress Report: Add Advanced Physics to the Race Room

**Date**: March 20, 2024
**Updated**: March 24, 2024

## Description
This task involved adding advanced physics simulation to the race room in the backend. The goal was to create a sloped track with realistic physics for toy cars racing down it, including gravity, friction, and collisions. The physics simulation is implemented on the server and car positions and orientations are broadcast to clients.

## Planning
- **Objectives**:
  - Implement advanced physics simulation in the backend race room
  - Create a sloped track for cars to race down
  - Set up cars with physical properties based on shared car attributes
  - Implement realistic gravity, friction, and collision mechanics
  - Broadcast car positions and orientations to clients

- **Approach**:
  - Set up Cannon.js for physics simulation
  - Create physics classes to manage the world, track, and cars
  - Integrate physics with the existing race room
  - Update player state with physics simulation results
  - Add race events like finish line detection and off-track detection

- **Potential Challenges**:
  - Balancing physics parameters for realistic yet fun gameplay
  - Optimizing performance while maintaining accurate physics
  - Ensuring consistent physics simulation across different car types
  - Managing synchronization between physics engine and Colyseus state

- **Dependencies**:
  - Cannon.js for physics simulation
  - Shared package for car attributes
  - Existing RaceRoom and RaceRoomState implementation

## Implementation
- **Actions Taken**:
  1. Created a `PhysicsWorld` class to handle the physics simulation, including:
     - Setting up the Cannon.js world with gravity
     - Creating a sloped track with walls
     - Implementing car creation based on car attributes
     - Adding methods to detect when cars cross the finish line or go off-track

  2. Created a `PhysicsManager` to coordinate between the physics world and game state:
     - Managing player car bodies
     - Updating player transforms based on physics
     - Tracking race status (off-track, finished, etc.)
     - Handling race start and finish events

  3. Updated the `RaceRoomState` schema to include physics-related data:
     - Added a `Transform` class for position and rotation
     - Added race status fields (off-track, finished, finish time)
     - Added race timing information

  4. Enhanced the `RaceRoom` class with physics integration:
     - Added car selection and player ready handlers
     - Implemented race start and update logic
     - Set up a physics update loop
     - Added race completion detection and result broadcasting

- **Tests Performed**:
  - Started the server to verify it runs without errors
  - Verified that the physics code compiles correctly
  - Checked that the state schema includes all necessary physics data
  - Verified that the race room properly initializes the physics manager

- **Results**: The server successfully initializes with the physics implementation. The physics simulation is set up to simulate realistic car races with gravity, collisions, and friction. Cars are positioned at the top of a sloped track and race to the bottom, with their positions and orientations broadcast to clients for rendering.

## Issues and Resolutions
- **Module Import Issue**: Initially had issues importing from the shared package. Resolved by using the correct package name `@toy-racers/shared` instead of just `shared`.
- **TypeScript Type Issues**: Encountered type errors with Cannon.js. Addressed by using explicit type assertions where needed.
- **Property Initialization**: Fixed a linter warning about uninitialized class properties by providing default initializers.

## Decisions Made
- **Track Design**: Created a simple sloped track with small walls that fits the game's toy car racing theme. The track is 20 meters long, 6 meters wide, and sloped at 15 degrees.
- **Physics Parameters**: Set gravity to standard Earth gravity (9.82 m/s²) and tuned friction and restitution values to match a toy car racing experience.
- **Update Rate**: Set the physics update rate to approximately 60Hz (16ms intervals) to balance simulation accuracy with performance.
- **Car Positioning**: Placed cars slightly apart (left and right) at the start to prevent immediate collisions and give each car a fair start.
- **Race Events**: Implemented detection for two key race events: crossing the finish line and going off track, both of which can determine the race winner.

## Update Notes
- **March 24, 2024**: The physics system has been scaled down to match realistic Hot Wheels toy car dimensions. Track dimensions reduced from 10m to 2m length and 50cm to 15cm width. Car dimensions scaled to 7-8cm length, and physics parameters adjusted accordingly. See [Toy Scale Adjustments](./phase2-step6-toy-scale-adjustments.md) for complete details.