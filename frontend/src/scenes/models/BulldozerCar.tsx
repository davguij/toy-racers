import { Color3, Vector3 } from '@babylonjs/core';
import type { Car } from '@toy-racers/shared';
import type React from 'react';
import { Box, Cylinder } from 'react-babylonjs';

interface BulldozerCarProps {
  car: Car;
  position?: Vector3;
  rotation?: Vector3;
}

/**
 * Component for the Bulldozer car model.
 * A heavy-duty truck with excellent momentum and collision advantage.
 */
export const BulldozerCar: React.FC<BulldozerCarProps> = ({
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
  const wheelRadius = width * visualScale * 0.2; // Larger wheels for truck

  return (
    <transformNode
      name={`car-${car.id}`}
      position={position}
      rotation={rotation}
    >
      {/* Truck base/chassis */}
      <Box
        name={`${car.id}-base`}
        width={width * visualScale}
        height={height * visualScale * 0.5}
        depth={length * visualScale}
        position={new Vector3(0, height * visualScale * 0.25, 0)}
      >
        <standardMaterial
          name={`${car.id}-base-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Truck cab */}
      <Box
        name={`${car.id}-cab`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.8}
        depth={length * visualScale * 0.4}
        position={
          new Vector3(
            0,
            height * visualScale * 0.9,
            length * visualScale * 0.25,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-cab-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Truck bed */}
      <Box
        name={`${car.id}-bed`}
        width={width * visualScale * 0.95}
        height={height * visualScale * 0.4}
        depth={length * visualScale * 0.5}
        position={
          new Vector3(
            0,
            height * visualScale * 0.7,
            -length * visualScale * 0.2,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-bed-material`}
          diffuseColor={Color3.FromHexString('#333333')}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Front window */}
      <Box
        name={`${car.id}-window`}
        width={width * visualScale * 0.8}
        height={height * visualScale * 0.4}
        depth={0.01}
        position={
          new Vector3(
            0,
            height * visualScale * 1.1,
            length * visualScale * 0.45,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-window-material`}
          diffuseColor={Color3.FromHexString('#222222')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Front bumper - extra heavy duty */}
      <Box
        name={`${car.id}-bumper`}
        width={width * visualScale * 1.05}
        height={height * visualScale * 0.2}
        depth={length * visualScale * 0.1}
        position={
          new Vector3(
            0,
            height * visualScale * 0.25,
            length * visualScale * 0.55,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-bumper-material`}
          diffuseColor={Color3.FromHexString('#555555')}
          specularColor={Color3.White()}
          specularPower={16}
        />
      </Box>

      {/* Wheels - offroad type (thicker) */}
      {/* Front Left */}
      <Cylinder
        name={`${car.id}-wheel-fl`}
        height={wheelRadius * 0.6}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.55,
            wheelRadius,
            length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fl`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>

      {/* Front Right */}
      <Cylinder
        name={`${car.id}-wheel-fr`}
        height={wheelRadius * 0.6}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.55,
            wheelRadius,
            length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fr`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>

      {/* Rear Left */}
      <Cylinder
        name={`${car.id}-wheel-rl`}
        height={wheelRadius * 0.6}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.55,
            wheelRadius,
            -length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rl`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>

      {/* Rear Right */}
      <Cylinder
        name={`${car.id}-wheel-rr`}
        height={wheelRadius * 0.6}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.55,
            wheelRadius,
            -length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rr`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>
    </transformNode>
  );
};
