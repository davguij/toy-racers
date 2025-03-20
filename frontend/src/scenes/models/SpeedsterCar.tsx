import { Color3, Vector3 } from '@babylonjs/core';
import type { Car } from '@toy-racers/shared';
import type React from 'react';
import { Box, Cylinder } from 'react-babylonjs';

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
  const accentColor = Color3.FromHexString('#111111'); // Dark accent color

  // Get dimensions from car
  const { length, width, height } = car.dimensions;

  // Scale factors for visual representation
  const visualScale = 10; // Make the car visually larger than physics dimensions but appropriate for toy size
  const wheelRadius = width * visualScale * 0.15;
  const wheelWidth = wheelRadius * 0.5;

  return (
    <transformNode
      name={`car-${car.id}`}
      position={position}
      rotation={rotation}
    >
      {/* Main chassis - sleek and low */}
      <Box
        name={`${car.id}-chassis`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.2}
        depth={length * visualScale * 0.9}
        position={new Vector3(0, height * visualScale * 0.1, 0)}
      >
        <standardMaterial
          name={`${car.id}-chassis-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Box>

      {/* Main body - curved sports car shape */}
      <Box
        name={`${car.id}-body`}
        width={width * visualScale * 0.85}
        height={height * visualScale * 0.3}
        depth={length * visualScale * 0.8}
        position={new Vector3(0, height * visualScale * 0.35, 0)}
      >
        <standardMaterial
          name={`${car.id}-body-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Box>

      {/* Front hood - sloped aerodynamic design */}
      <Box
        name={`${car.id}-hood`}
        width={width * visualScale * 0.8}
        height={height * visualScale * 0.12}
        depth={length * visualScale * 0.4}
        position={
          new Vector3(
            0,
            height * visualScale * 0.31,
            length * visualScale * 0.25,
          )
        }
        rotation={new Vector3(-Math.PI * 0.05, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-hood-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Box>

      {/* Front bumper */}
      <Box
        name={`${car.id}-front-bumper`}
        width={width * visualScale * 0.85}
        height={height * visualScale * 0.15}
        depth={length * visualScale * 0.1}
        position={
          new Vector3(
            0,
            height * visualScale * 0.15,
            length * visualScale * 0.45,
          )
        }
        rotation={new Vector3(0, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-front-bumper-material`}
          diffuseColor={accentColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Front lights */}
      <Box
        name={`${car.id}-headlight-left`}
        width={width * visualScale * 0.15}
        height={height * visualScale * 0.08}
        depth={length * visualScale * 0.05}
        position={
          new Vector3(
            -width * visualScale * 0.3,
            height * visualScale * 0.25,
            length * visualScale * 0.45,
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
        height={height * visualScale * 0.08}
        depth={length * visualScale * 0.05}
        position={
          new Vector3(
            width * visualScale * 0.3,
            height * visualScale * 0.25,
            length * visualScale * 0.45,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-headlight-right-material`}
          diffuseColor={Color3.FromHexString('#FFFF99')}
          emissiveColor={Color3.FromHexString('#FFFF44')}
        />
      </Box>

      {/* Windshield */}
      <Box
        name={`${car.id}-windshield`}
        width={width * visualScale * 0.75}
        height={height * visualScale * 0.35}
        depth={length * visualScale * 0.25}
        position={
          new Vector3(
            0,
            height * visualScale * 0.55,
            length * visualScale * 0.1,
          )
        }
        rotation={new Vector3(-Math.PI * 0.12, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-windshield-material`}
          diffuseColor={Color3.FromHexString('#111111')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Roof - low, aerodynamic */}
      <Box
        name={`${car.id}-roof`}
        width={width * visualScale * 0.75}
        height={height * visualScale * 0.15}
        depth={length * visualScale * 0.35}
        position={
          new Vector3(
            0,
            height * visualScale * 0.65,
            -length * visualScale * 0.05,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-roof-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Box>

      {/* Rear window */}
      <Box
        name={`${car.id}-rear-window`}
        width={width * visualScale * 0.7}
        height={height * visualScale * 0.25}
        depth={length * visualScale * 0.15}
        position={
          new Vector3(
            0,
            height * visualScale * 0.55,
            -length * visualScale * 0.25,
          )
        }
        rotation={new Vector3(Math.PI * 0.3, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-rear-window-material`}
          diffuseColor={Color3.FromHexString('#111111')}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Rear spoiler */}
      <Box
        name={`${car.id}-spoiler-base`}
        width={width * visualScale * 0.7}
        height={height * visualScale * 0.08}
        depth={length * visualScale * 0.1}
        position={
          new Vector3(
            0,
            height * visualScale * 0.5,
            -length * visualScale * 0.4,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-spoiler-base-material`}
          diffuseColor={accentColor}
        />
      </Box>

      <Box
        name={`${car.id}-spoiler-wing`}
        width={width * visualScale * 0.8}
        height={height * visualScale * 0.05}
        depth={length * visualScale * 0.12}
        position={
          new Vector3(
            0,
            height * visualScale * 0.65,
            -length * visualScale * 0.4,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-spoiler-wing-material`}
          diffuseColor={accentColor}
        />
      </Box>

      {/* Wheels - racing style with rims */}
      {/* Front Left */}
      <Cylinder
        name={`${car.id}-wheel-fl`}
        height={wheelWidth}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.45,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fl`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>

      {/* Front Left Rim */}
      <Cylinder
        name={`${car.id}-rim-fl`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.4}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.45,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-fl`}
          diffuseColor={Color3.FromHexString('#CCCCCC')}
          specularColor={Color3.White()}
          specularPower={96}
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
            width * visualScale * 0.45,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-fr`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>

      {/* Front Right Rim */}
      <Cylinder
        name={`${car.id}-rim-fr`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.4}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.45,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-fr`}
          diffuseColor={Color3.FromHexString('#CCCCCC')}
          specularColor={Color3.White()}
          specularPower={96}
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
            -width * visualScale * 0.45,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rl`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>

      {/* Rear Left Rim */}
      <Cylinder
        name={`${car.id}-rim-rl`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.4}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.45,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-rl`}
          diffuseColor={Color3.FromHexString('#CCCCCC')}
          specularColor={Color3.White()}
          specularPower={96}
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
            width * visualScale * 0.45,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-wheel-material-rr`}
          diffuseColor={Color3.Black()}
        />
      </Cylinder>

      {/* Rear Right Rim */}
      <Cylinder
        name={`${car.id}-rim-rr`}
        height={wheelWidth + 0.01}
        diameter={wheelRadius * 1.4}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.45,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-rr`}
          diffuseColor={Color3.FromHexString('#CCCCCC')}
          specularColor={Color3.White()}
          specularPower={96}
        />
      </Cylinder>
    </transformNode>
  );
};
