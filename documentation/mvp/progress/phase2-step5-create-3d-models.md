# Progress Report: Create 3D Models for Cars and Track

**Date**: March 20, 2024

## Description
This task involved creating 3D models for 3 different toy cars (Speedster, Bulldozer, All-Rounder) with unique visual characteristics that match their defined physical attributes, and developing a "Living Room Loop" track model with slopes, turns, and small walls.

## Planning
- **Objectives**:
  - Create 3D models for the 3 predefined cars (Speedster, Bulldozer, All-Rounder)
  - Create a "Living Room Loop" track model with slopes, turns, and small walls
  - Set up the frontend structure to support 3D rendering with Babylon.js
  - Ensure models match the physical attributes defined in the shared package
  - Implement camera switching functionality

- **Approach**:
  - Install Babylon.js and related packages for 3D rendering
  - Create a dedicated scenes directory for 3D components
  - Implement car models using primitive shapes to ensure lightweight performance
  - Build a track scene that resembles a living room environment
  - Add camera controls for first-person and third-person views
  - Integrate the 3D scene with the existing Game component

- **Potential Challenges**:
  - Creating visually distinct car models that match their physical attributes
  - Ensuring proper scaling between cars and track
  - Balancing visual detail with performance
  - Syncing the 3D visualization with the physics simulation happening on the server

- **Dependencies**:
  - Shared package car definitions
  - Babylon.js for 3D rendering
  - React integration for Babylon.js
  - Game component that receives player state from the server

## Implementation
- **Actions Taken**:
  1. Installed the necessary dependencies:
     - @babylonjs/core
     - @babylonjs/loaders
     - react-babylonjs

  2. Created car models with primitive shapes matching their attributes:
     - Speedster: Low, aerodynamic sports car with racing wheels
     - Bulldozer: Heavy-duty truck with large, offroad wheels and a robust body
     - All-Rounder: Balanced sedan with standard wheels and even proportions

  3. Implemented a "Living Room Loop" track with these features:
     - Wooden floor with a slight slope
     - Small walls on both sides
     - Start and finish line
     - Obstacles resembling toys in a living room
     - Proper scaling to match the physics simulation

  4. Created a car factory component to select the appropriate car model based on ID

  5. Developed a track scene component with:
     - 3D rendering of the track and cars
     - Dynamic camera positioning for both first-person and third-person views
     - Lighting to enhance the visual experience
     - Player-car mapping and positioning

  6. Updated the Game component to:
     - Include the 3D track scene
     - Provide camera mode switching
     - Display race information alongside the 3D view

  7. Added CSS styling for the 3D scene and game interface

- **Tests Performed**:
  - Checked that Babylon.js components integrate correctly with React
  - Verified that car models match their physical attributes
  - Confirmed that the scale of models is appropriate and consistent
  - Reviewed visual appearance for clarity and aesthetics

- **Results**: The 3D models have been created and the track scene is ready to be rendered. The car models visually match their physical attributes, and the "Living Room Loop" track provides an appropriate environment for toy car racing. The code is organized in a way that supports future expansion and optimization.

## Issues and Resolutions
- **React-Babylon.js Typings**: Initially encountered TypeScript issues with the integration. Resolved by properly typing components and JSX elements.
- **Scale Consistency**: Addressed scaling differences between the physical simulation and visual representation by implementing a consistent visual scale factor.
- **Camera Positioning**: The initial camera positioning was not ideal; solved by implementing dynamic camera positioning based on player car location.

## Decisions Made
- **Primitive Shapes for Models**: Used primitive shapes (boxes, cylinders, spheres) rather than complex 3D models to ensure good performance across different devices. This approach also keeps the codebase simpler while still providing visually distinct car models.
- **Visual Scale Factor**: Implemented a visual scale multiplier (20x) to make the cars more visible while maintaining the same proportions as the physics models. This ensures the visual representation is consistent with the physics simulation but more easily viewable.
- **Camera Modes**: Added both first-person and third-person camera views to enhance the spectator experience, following the game design document's requirement for multiple viewing angles.
- **Living Room Theme**: Designed the track to resemble a wooden floor with toy-like obstacles to match the game's theme of toy cars racing in a household environment.
- **Component Structure**: Organized the code with a clear separation between the 3D models, scene rendering, and game interface to facilitate future enhancements and maintenance.