# Progress Report: Define Car Attributes in the Shared Package

**Date**: March 20, 2024

## Description
This task involved defining car attributes in the shared package so that both the front-end and back-end can use them consistently. Car attributes include physical properties like weight, size, and wheel type that affect the car's behavior in the physics simulation.

## Planning
- **Objectives**: Define a car type and create at least 3 predefined cars with different attributes.
- **Approach**:
  - Create TypeScript types in the shared package
  - Define enums for categorical attributes like car shape and wheel type
  - Create predefined cars with balanced attributes for gameplay
  - Implement utility functions to access cars
- **Potential Challenges**: Balancing car attributes to ensure each has unique strengths and weaknesses
- **Dependencies**: TypeScript for type definitions

## Implementation
- **Actions Taken**:
  1. Created a directory structure in the shared package: `src/types` and `src/constants`
  2. Defined car types in `src/types/cars.ts`:
     - Created enums for car shapes, wheel types, and sizes
     - Defined a `CarDimensions` interface for 3D dimensions
     - Created a comprehensive `Car` interface with physical, physics, and visual attributes
  3. Created predefined cars in `src/constants/cars.ts`:
     - Implemented 3 cars with different attributes: Speedster, Bulldozer, and All-Rounder
     - Added utility functions `getCarById` and `getAllCars`
  4. Set up proper exports in `src/index.ts`
  5. Updated the package.json to point to the correct main file
  6. Created a tsconfig.json file with appropriate settings
  7. Built the package to verify correct functionality

- **Tests Performed**:
  - Successfully compiled the shared package
  - Manually verified that 3 cars were defined with all required attributes
  - Checked that each car has unique attributes that would affect physics behavior
  - Confirmed that utility functions were properly exposed

- **Results**: The shared package was successfully created with the car type definitions and predefined cars. The package can now be imported by both the front-end and back-end to ensure consistent car attributes.

## Issues and Resolutions
- **Linter Warning**: Encountered a linter warning about imports being used only as types. Resolved by changing the import statement to use the `type` keyword for type-only imports.

## Decisions Made
- Defined car attributes based on physics needs:
  - `weight` affects momentum and collision impact
  - `size` and `dimensions` impact stability
  - `shape` affects aerodynamics
  - `wheelType` determines traction
  - Added `friction` and `restitution` for physics calculations
- Created three distinct car types to provide strategic gameplay choices:
  - Speedster: Light and fast but less stable
  - Bulldozer: Heavy with good traction but slower
  - All-Rounder: Balanced performance across attributes