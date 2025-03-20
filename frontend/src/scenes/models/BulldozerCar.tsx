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
  const secondaryColor = Color3.FromHexString('#333333'); // Dark grey for secondary parts
  const metalColor = Color3.FromHexString('#777777'); // Metal color for details

  // Get dimensions from car
  const { length, width, height } = car.dimensions;

  // Scale factors for visual representation
  const visualScale = 10; // Make the car visually larger than physics dimensions but appropriate for toy size
  const wheelRadius = width * visualScale * 0.22; // Large wheels for bulldozer
  const wheelWidth = wheelRadius * 0.8; // Thick wheels

  return (
    <transformNode
      name={`car-${car.id}`}
      position={position}
      rotation={rotation}
    >
      {/* Truck chassis/base - wide and sturdy */}
      <Box
        name={`${car.id}-chassis`}
        width={width * visualScale}
        height={height * visualScale * 0.3}
        depth={length * visualScale * 0.9}
        position={new Vector3(0, height * visualScale * 0.15, 0)}
      >
        <standardMaterial
          name={`${car.id}-chassis-material`}
          diffuseColor={secondaryColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Main body - heavy duty truck */}
      <Box
        name={`${car.id}-main-body`}
        width={width * visualScale * 0.95}
        height={height * visualScale * 0.4}
        depth={length * visualScale * 0.55}
        position={
          new Vector3(
            0,
            height * visualScale * 0.5,
            length * visualScale * 0.15,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-main-body-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Truck cab/hood - angled front */}
      <Box
        name={`${car.id}-hood`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.38}
        depth={length * visualScale * 0.25}
        position={
          new Vector3(
            0,
            height * visualScale * 0.49,
            length * visualScale * 0.4,
          )
        }
        rotation={new Vector3(Math.PI * 0.05, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-hood-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Cabin */}
      <Box
        name={`${car.id}-cabin`}
        width={width * visualScale * 0.85}
        height={height * visualScale * 0.45}
        depth={length * visualScale * 0.3}
        position={
          new Vector3(0, height * visualScale * 0.8, length * visualScale * 0.1)
        }
      >
        <standardMaterial
          name={`${car.id}-cabin-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Windshield */}
      <Box
        name={`${car.id}-windshield`}
        width={width * visualScale * 0.8}
        height={height * visualScale * 0.4}
        depth={0.01}
        position={
          new Vector3(
            0,
            height * visualScale * 0.8,
            length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(Math.PI * 0.05, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-windshield-material`}
          diffuseColor={Color3.FromHexString('#222222')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Side windows */}
      <Box
        name={`${car.id}-window-left`}
        width={0.01}
        height={height * visualScale * 0.35}
        depth={length * visualScale * 0.25}
        position={
          new Vector3(
            -width * visualScale * 0.43,
            height * visualScale * 0.8,
            length * visualScale * 0.1,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-window-left-material`}
          diffuseColor={Color3.FromHexString('#222222')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      <Box
        name={`${car.id}-window-right`}
        width={0.01}
        height={height * visualScale * 0.35}
        depth={length * visualScale * 0.25}
        position={
          new Vector3(
            width * visualScale * 0.43,
            height * visualScale * 0.8,
            length * visualScale * 0.1,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-window-right-material`}
          diffuseColor={Color3.FromHexString('#222222')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Truck bed */}
      <Box
        name={`${car.id}-bed`}
        width={width * visualScale * 0.95}
        height={height * visualScale * 0.4}
        depth={length * visualScale * 0.4}
        position={
          new Vector3(
            0,
            height * visualScale * 0.5,
            -length * visualScale * 0.25,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-bed-material`}
          diffuseColor={secondaryColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Truck bed sides */}
      <Box
        name={`${car.id}-bed-left-side`}
        width={width * visualScale * 0.05}
        height={height * visualScale * 0.2}
        depth={length * visualScale * 0.38}
        position={
          new Vector3(
            -width * visualScale * 0.45,
            height * visualScale * 0.6,
            -length * visualScale * 0.25,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-bed-left-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      <Box
        name={`${car.id}-bed-right-side`}
        width={width * visualScale * 0.05}
        height={height * visualScale * 0.2}
        depth={length * visualScale * 0.38}
        position={
          new Vector3(
            width * visualScale * 0.45,
            height * visualScale * 0.6,
            -length * visualScale * 0.25,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-bed-right-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      <Box
        name={`${car.id}-bed-back`}
        width={width * visualScale * 0.95}
        height={height * visualScale * 0.2}
        depth={width * visualScale * 0.05}
        position={
          new Vector3(
            0,
            height * visualScale * 0.6,
            -length * visualScale * 0.44,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-bed-back-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Front bumper - extra heavy duty with plow shape */}
      <Box
        name={`${car.id}-bumper`}
        width={width * visualScale * 1.1}
        height={height * visualScale * 0.25}
        depth={length * visualScale * 0.12}
        position={
          new Vector3(0, height * visualScale * 0.2, length * visualScale * 0.5)
        }
      >
        <standardMaterial
          name={`${car.id}-bumper-material`}
          diffuseColor={metalColor}
          specularColor={Color3.White()}
          specularPower={96}
        />
      </Box>

      {/* Headlights */}
      <Box
        name={`${car.id}-headlight-left`}
        width={width * visualScale * 0.15}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.05}
        position={
          new Vector3(
            -width * visualScale * 0.3,
            height * visualScale * 0.35,
            length * visualScale * 0.5,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-headlight-left-material`}
          diffuseColor={Color3.FromHexString('#FFFF99')}
          emissiveColor={Color3.FromHexString('#FFFF44')}
        />
      </Box>

      <Box
        name={`${car.id}-headlight-right`}
        width={width * visualScale * 0.15}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.05}
        position={
          new Vector3(
            width * visualScale * 0.3,
            height * visualScale * 0.35,
            length * visualScale * 0.5,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-headlight-right-material`}
          diffuseColor={Color3.FromHexString('#FFFF99')}
          emissiveColor={Color3.FromHexString('#FFFF44')}
        />
      </Box>

      {/* Roof lights (emergency style) */}
      <Box
        name={`${car.id}-roof-light-1`}
        width={width * visualScale * 0.1}
        height={height * visualScale * 0.08}
        depth={length * visualScale * 0.15}
        position={
          new Vector3(
            -width * visualScale * 0.2,
            height * visualScale * 1.15,
            length * visualScale * 0.1,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-roof-light-material-1`}
          diffuseColor={Color3.FromHexString('#FFFF00')}
          emissiveColor={Color3.FromHexString('#FFAA00')}
        />
      </Box>

      <Box
        name={`${car.id}-roof-light-2`}
        width={width * visualScale * 0.1}
        height={height * visualScale * 0.08}
        depth={length * visualScale * 0.15}
        position={
          new Vector3(
            width * visualScale * 0.2,
            height * visualScale * 1.15,
            length * visualScale * 0.1,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-roof-light-material-2`}
          diffuseColor={Color3.FromHexString('#FFFF00')}
          emissiveColor={Color3.FromHexString('#FFAA00')}
        />
      </Box>

      {/* Exhaust pipes */}
      <Cylinder
        name={`${car.id}-exhaust-1`}
        height={height * visualScale * 0.5}
        diameter={width * visualScale * 0.07}
        segments={12}
        position={
          new Vector3(
            -width * visualScale * 0.4,
            height * visualScale * 0.7,
            -length * visualScale * 0.15,
          )
        }
        rotation={new Vector3(0, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-exhaust-material-1`}
          diffuseColor={metalColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Cylinder>

      <Cylinder
        name={`${car.id}-exhaust-2`}
        height={height * visualScale * 0.5}
        diameter={width * visualScale * 0.07}
        segments={12}
        position={
          new Vector3(
            width * visualScale * 0.4,
            height * visualScale * 0.7,
            -length * visualScale * 0.15,
          )
        }
        rotation={new Vector3(0, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-exhaust-material-2`}
          diffuseColor={metalColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Cylinder>

      {/* Wheels - large, offroad type */}
      {/* Front Left */}
      <Cylinder
        name={`${car.id}-wheel-fl`}
        height={wheelWidth}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.5,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fl`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>

      {/* Front Left Rim */}
      <Cylinder
        name={`${car.id}-rim-fl`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.5,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-fl`}
          diffuseColor={metalColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Cylinder>

      {/* Front Right */}
      <Cylinder
        name={`${car.id}-wheel-fr`}
        height={wheelWidth}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.5,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fr`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>

      {/* Front Right Rim */}
      <Cylinder
        name={`${car.id}-rim-fr`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.5,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-fr`}
          diffuseColor={metalColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Cylinder>

      {/* Rear Left */}
      <Cylinder
        name={`${car.id}-wheel-rl`}
        height={wheelWidth}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.5,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rl`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>

      {/* Rear Left Rim */}
      <Cylinder
        name={`${car.id}-rim-rl`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.5,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-rl`}
          diffuseColor={metalColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Cylinder>

      {/* Rear Right */}
      <Cylinder
        name={`${car.id}-wheel-rr`}
        height={wheelWidth}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.5,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rr`}
          diffuseColor={Color3.FromHexString('#111111')}
        />
      </Cylinder>

      {/* Rear Right Rim */}
      <Cylinder
        name={`${car.id}-rim-rr`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.2}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.5,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-rr`}
          diffuseColor={metalColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Cylinder>
    </transformNode>
  );
};
