import { Color3, Vector3 } from '@babylonjs/core';
import type { Car } from '@toy-racers/shared';
import type React from 'react';
import { Box, Cylinder } from 'react-babylonjs';

interface AllRounderCarProps {
  car: Car;
  position?: Vector3;
  rotation?: Vector3;
}

/**
 * Component for the All-Rounder car model.
 * A balanced sedan with good performance across different track conditions.
 */
export const AllRounderCar: React.FC<AllRounderCarProps> = ({
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
  const wheelRadius = width * visualScale * 0.175; // Medium sized wheels

  return (
    <transformNode
      name={`car-${car.id}`}
      position={position}
      rotation={rotation}
    >
      {/* Car base/chassis */}
      <Box
        name={`${car.id}-base`}
        width={width * visualScale}
        height={height * visualScale * 0.4}
        depth={length * visualScale}
        position={new Vector3(0, height * visualScale * 0.2, 0)}
      >
        <standardMaterial
          name={`${car.id}-base-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={48}
        />
      </Box>

      {/* Car body - sedan shape */}
      <Box
        name={`${car.id}-body`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.5}
        depth={length * visualScale * 0.8}
        position={new Vector3(0, height * visualScale * 0.65, 0)}
      >
        <standardMaterial
          name={`${car.id}-body-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={48}
        />
      </Box>

      {/* Windshield */}
      <Box
        name={`${car.id}-windshield`}
        width={width * visualScale * 0.85}
        height={height * visualScale * 0.3}
        depth={0.01}
        position={
          new Vector3(
            0,
            height * visualScale * 0.85,
            length * visualScale * 0.25,
          )
        }
        rotation={new Vector3(-Math.PI / 8, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-windshield-material`}
          diffuseColor={Color3.FromHexString('#222222')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Rear window */}
      <Box
        name={`${car.id}-rear-window`}
        width={width * visualScale * 0.85}
        height={height * visualScale * 0.3}
        depth={0.01}
        position={
          new Vector3(
            0,
            height * visualScale * 0.85,
            -length * visualScale * 0.25,
          )
        }
        rotation={new Vector3(Math.PI / 8, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-rear-window-material`}
          diffuseColor={Color3.FromHexString('#222222')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Trunk */}
      <Box
        name={`${car.id}-trunk`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.2}
        position={
          new Vector3(
            0,
            height * visualScale * 0.7,
            -length * visualScale * 0.4,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-trunk-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={48}
        />
      </Box>

      {/* Hood */}
      <Box
        name={`${car.id}-hood`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.2}
        position={
          new Vector3(
            0,
            height * visualScale * 0.65,
            length * visualScale * 0.4,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-hood-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={48}
        />
      </Box>

      {/* Wheels - standard type */}
      {/* Front Left */}
      <Cylinder
        name={`${car.id}-wheel-fl`}
        height={wheelRadius * 0.5}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.52,
            wheelRadius,
            length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fl`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>

      {/* Front Right */}
      <Cylinder
        name={`${car.id}-wheel-fr`}
        height={wheelRadius * 0.5}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.52,
            wheelRadius,
            length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fr`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>

      {/* Rear Left */}
      <Cylinder
        name={`${car.id}-wheel-rl`}
        height={wheelRadius * 0.5}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.52,
            wheelRadius,
            -length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rl`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>

      {/* Rear Right */}
      <Cylinder
        name={`${car.id}-wheel-rr`}
        height={wheelRadius * 0.5}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.52,
            wheelRadius,
            -length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI / 2, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rr`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>
    </transformNode>
  );
};
