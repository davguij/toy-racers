import type { Car } from '../types/cars';
import { CarShape, CarSize, WheelType } from '../types/cars';

/**
 * Predefined cars available in the game.
 * Each car has unique physical attributes that affect its performance.
 */
export const PREDEFINED_CARS: Car[] = [
  {
    id: 'speedster',
    name: 'Speedster',
    description:
      'A lightweight, aerodynamic sports car that excels on straight paths but can be unstable on turns.',
    weight: 30, // Lightweight Hot Wheels car
    size: CarSize.SMALL,
    dimensions: {
      length: 0.075, // ~7.5cm length
      width: 0.025, // ~2.5cm width
      height: 0.022, // ~2.2cm height
    },
    shape: CarShape.SPORTS,
    wheelType: WheelType.RACING,
    friction: 0.7, // Good traction
    restitution: 0.3, // Some bounce, but not too much
    color: '#FF5733', // Bright red/orange
  },
  {
    id: 'bulldozer',
    name: 'Bulldozer',
    description:
      'A heavy-duty truck with excellent momentum and collision advantage, but slower on straightaways.',
    weight: 45, // Heavier Hot Wheels truck
    size: CarSize.LARGE,
    dimensions: {
      length: 0.08, // ~8cm length (slightly bigger)
      width: 0.03, // ~3cm width
      height: 0.025, // ~2.5cm height
    },
    shape: CarShape.TRUCK,
    wheelType: WheelType.OFFROAD,
    friction: 0.9, // Excellent traction
    restitution: 0.1, // Low bounce
    color: '#3366FF', // Blue
  },
  {
    id: 'allrounder',
    name: 'All-Rounder',
    description:
      'A balanced sedan with good performance across different track conditions.',
    weight: 38, // Medium weight Hot Wheels car
    size: CarSize.MEDIUM,
    dimensions: {
      length: 0.077, // ~7.7cm length
      width: 0.027, // ~2.7cm width
      height: 0.023, // ~2.3cm height
    },
    shape: CarShape.SEDAN,
    wheelType: WheelType.STANDARD,
    friction: 0.8, // Good traction
    restitution: 0.2, // Moderate bounce
    color: '#33FF57', // Green
  },
];

/**
 * Retrieves a car by its ID.
 * @param id The unique identifier of the car
 * @returns The car with the specified ID or undefined if not found
 */
export function getCarById(id: string): Car | undefined {
  return PREDEFINED_CARS.find((car) => car.id === id);
}

/**
 * Returns all available cars.
 * @returns Array of all predefined cars
 */
export function getAllCars(): Car[] {
  return [...PREDEFINED_CARS];
}
