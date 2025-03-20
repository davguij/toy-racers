import { Color3, Vector3 } from '@babylonjs/core';
import type { Car } from '@toy-racers/shared';
import type React from 'react';
import { Box, Sphere } from 'react-babylonjs';

interface SpeedsterCarProps {
  car: Car;
  position?: Vector3;
  rotation?: Vector3;
}

/**
 * Component for the Speedster car model.
 * A lightweight, aerodynamic sports car that excels on straight paths.
 */
export const SpeedsterCar: React.FC<SpeedsterCarProps> = ({
  car,
  position = Vector3.Zero(),
  rotation = Vector3.Zero(),
}) => {
  // Convert hex color to Babylon.js Color3
  const carColor = Color3.FromHexString(car.color);

  // Get dimensions from car
  const { length, width, height } = car.dimensions;

  // Scale factors for visual representation
  const visualScale = 20; // Make the car visually larger than physics dimensions
  const wheelRadius = width * visualScale * 0.15;

  return (
    <transformNode
      name={`car-${car.id}`}
      position={position}
      rotation={rotation}
    >
      {/* Car body - low and aerodynamic */}
      <Box
        name={`${car.id}-body`}
        width={width * visualScale}
        height={height * visualScale * 0.6}
        depth={length * visualScale}
        position={new Vector3(0, height * visualScale * 0.3, 0)}
      >
        <standardMaterial
          name={`${car.id}-body-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Box>

      {/* Aerodynamic hood */}
      <Box
        name={`${car.id}-hood`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.2}
        depth={length * visualScale * 0.5}
        position={
          new Vector3(0, height * visualScale * 0.6, length * visualScale * 0.2)
        }
      >
        <standardMaterial
          name={`${car.id}-hood-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Box>

      {/* Cabin / Windshield */}
      <Box
        name={`${car.id}-cabin`}
        width={width * visualScale * 0.7}
        height={height * visualScale * 0.4}
        depth={length * visualScale * 0.3}
        position={
          new Vector3(
            0,
            height * visualScale * 0.8,
            -length * visualScale * 0.1,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-cabin-material`}
          diffuseColor={Color3.FromHexString('#222222')}
          alpha={0.7} // Semi-transparent for windows
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Wheels - racing type (thinner) */}
      {/* Front Left */}
      <Sphere
        name={`${car.id}-wheel-fl`}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.52,
            wheelRadius,
            length * visualScale * 0.35,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fl`}
          diffuseColor={Color3.Black()}
        />
      </Sphere>

      {/* Front Right */}
      <Sphere
        name={`${car.id}-wheel-fr`}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.52,
            wheelRadius,
            length * visualScale * 0.35,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fr`}
          diffuseColor={Color3.Black()}
        />
      </Sphere>

      {/* Rear Left */}
      <Sphere
        name={`${car.id}-wheel-rl`}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.52,
            wheelRadius,
            -length * visualScale * 0.35,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rl`}
          diffuseColor={Color3.Black()}
        />
      </Sphere>

      {/* Rear Right */}
      <Sphere
        name={`${car.id}-wheel-rr`}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.52,
            wheelRadius,
            -length * visualScale * 0.35,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rr`}
          diffuseColor={Color3.Black()}
        />
      </Sphere>
    </transformNode>
  );
};
