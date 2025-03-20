/**
 * Represents the shape of a toy car.
 * Affects aerodynamics and handling.
 */
export enum CarShape {
  SEDAN = 'sedan',
  SPORTS = 'sports',
  TRUCK = 'truck',
  SUV = 'suv'
}

/**
 * Represents the wheel type of a toy car.
 * Affects traction and speed on different surfaces.
 */
export enum WheelType {
  RACING = 'racing',
  OFFROAD = 'offroad',
  STANDARD = 'standard',
  SMOOTH = 'smooth'
}

/**
 * Represents the size category of a toy car.
 * Influences stability and interaction with obstacles.
 */
export enum CarSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

/**
 * Dimensions of a car in 3D space (in meters).
 */
export interface CarDimensions {
  length: number;
  width: number;
  height: number;
}

/**
 * Represents a toy car with unique physical attributes.
 */
export interface Car {
  id: string;
  name: string;
  description: string;

  // Physical attributes
  weight: number; // in grams
  size: CarSize;
  dimensions: CarDimensions;
  shape: CarShape;
  wheelType: WheelType;

  // Physics-related attributes
  friction: number; // Coefficient of friction (0-1)
  restitution: number; // Bounciness (0-1)

  // Visual attributes
  color: string;
  modelPath?: string; // Path to the 3D model (optional in MVP)
}