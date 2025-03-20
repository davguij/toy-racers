import type { Vector3 } from '@babylonjs/core';
import type { Car } from '@toy-racers/shared';
import type React from 'react';
import { AllRounderCar } from './AllRounderCar';
import { BulldozerCar } from './BulldozerCar';
import { SpeedsterCar } from './SpeedsterCar';

interface CarFactoryProps {
  car: Car;
  position?: Vector3;
  rotation?: Vector3;
}

/**
 * Factory component that renders the appropriate car model based on car ID.
 */
export const CarFactory: React.FC<CarFactoryProps> = ({
  car,
  position,
  rotation,
}) => {
  switch (car.id) {
    case 'speedster':
      return <SpeedsterCar car={car} position={position} rotation={rotation} />;
    case 'bulldozer':
      return <BulldozerCar car={car} position={position} rotation={rotation} />;
    case 'allrounder':
      return (
        <AllRounderCar car={car} position={position} rotation={rotation} />
      );
    default:
      console.warn(`Unknown car ID: ${car.id}, using AllRounder as fallback`);
      return (
        <AllRounderCar car={car} position={position} rotation={rotation} />
      );
  }
};
