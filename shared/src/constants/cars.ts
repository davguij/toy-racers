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
    description: 'A lightweight, aerodynamic sports car that excels on straight paths but can be unstable on turns.',
    weight: 50, // Lightweight
    size: CarSize.SMALL,
    dimensions: {
      length: 0.1,
      width: 0.05,
      height: 0.03
    },
    shape: CarShape.SPORTS,
    wheelType: WheelType.RACING,
    friction: 0.7, // Good traction
    restitution: 0.3, // Some bounce, but not too much
    color: '#FF5733' // Bright red/orange
  },
  {
    id: 'bulldozer',
    name: 'Bulldozer',
    description: 'A heavy-duty truck with excellent momentum and collision advantage, but slower on straightaways.',
    weight: 120, // Very heavy
    size: CarSize.LARGE,
    dimensions: {
      length: 0.12,
      width: 0.06,
      height: 0.05
    },
    shape: CarShape.TRUCK,
    wheelType: WheelType.OFFROAD,
    friction: 0.9, // Excellent traction
    restitution: 0.1, // Low bounce
    color: '#3366FF' // Blue
  },
  {
    id: 'allrounder',
    name: 'All-Rounder',
    description: 'A balanced sedan with good performance across different track conditions.',
    weight: 80, // Medium weight
    size: CarSize.MEDIUM,
    dimensions: {
      length: 0.11,
      width: 0.055,
      height: 0.035
    },
    shape: CarShape.SEDAN,
    wheelType: WheelType.STANDARD,
    friction: 0.8, // Good traction
    restitution: 0.2, // Moderate bounce
    color: '#33FF57' // Green
  }
];

/**
 * Retrieves a car by its ID.
 * @param id The unique identifier of the car
 * @returns The car with the specified ID or undefined if not found
 */
export function getCarById(id: string): Car | undefined {
  return PREDEFINED_CARS.find(car => car.id === id);
}

/**
 * Returns all available cars.
 * @returns Array of all predefined cars
 */
export function getAllCars(): Car[] {
  return [...PREDEFINED_CARS];
}