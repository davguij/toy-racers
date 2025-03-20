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
  const accentColor = Color3.FromHexString('#222222'); // Dark accent color for grille, etc
  const glassColor = Color3.FromHexString('#111111'); // Dark glass color

  // Get dimensions from car
  const { length, width, height } = car.dimensions;

  // Scale factors for visual representation
  const visualScale = 10; // Make the car visually larger than physics dimensions but appropriate for toy size
  const wheelRadius = width * visualScale * 0.17; // Medium sized wheels for balanced car
  const wheelWidth = wheelRadius * 0.6; // Medium wheel width

  return (
    <transformNode
      name={`car-${car.id}`}
      position={position}
      rotation={rotation}
    >
      {/* Car chassis - base platform */}
      <Box
        name={`${car.id}-chassis`}
        width={width * visualScale * 0.95}
        height={height * visualScale * 0.2}
        depth={length * visualScale * 0.95}
        position={new Vector3(0, height * visualScale * 0.1, 0)}
      >
        <standardMaterial
          name={`${car.id}-chassis-material`}
          diffuseColor={accentColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Car body - main sedan body */}
      <Box
        name={`${car.id}-body`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.35}
        depth={length * visualScale * 0.9}
        position={new Vector3(0, height * visualScale * 0.4, 0)}
      >
        <standardMaterial
          name={`${car.id}-body-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={48}
        />
      </Box>

      {/* Front hood */}
      <Box
        name={`${car.id}-hood`}
        width={width * visualScale * 0.88}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.25}
        position={
          new Vector3(
            0,
            height * visualScale * 0.33,
            length * visualScale * 0.35,
          )
        }
        rotation={new Vector3(-Math.PI * 0.02, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-hood-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={48}
        />
      </Box>

      {/* Front grille */}
      <Box
        name={`${car.id}-grille`}
        width={width * visualScale * 0.6}
        height={height * visualScale * 0.15}
        depth={length * visualScale * 0.05}
        position={
          new Vector3(
            0,
            height * visualScale * 0.25,
            length * visualScale * 0.46,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-grille-material`}
          diffuseColor={accentColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Front bumper */}
      <Box
        name={`${car.id}-front-bumper`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.15}
        depth={length * visualScale * 0.1}
        position={
          new Vector3(
            0,
            height * visualScale * 0.15,
            length * visualScale * 0.44,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-front-bumper-material`}
          diffuseColor={accentColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Headlights */}
      <Box
        name={`${car.id}-headlight-left`}
        width={width * visualScale * 0.2}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.05}
        position={
          new Vector3(
            -width * visualScale * 0.3,
            height * visualScale * 0.3,
            length * visualScale * 0.45,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-headlight-left-material`}
          diffuseColor={Color3.FromHexString('#FFFFCC')}
          emissiveColor={Color3.FromHexString('#FFFF99')}
        />
      </Box>

      <Box
        name={`${car.id}-headlight-right`}
        width={width * visualScale * 0.2}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.05}
        position={
          new Vector3(
            width * visualScale * 0.3,
            height * visualScale * 0.3,
            length * visualScale * 0.45,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-headlight-right-material`}
          diffuseColor={Color3.FromHexString('#FFFFCC')}
          emissiveColor={Color3.FromHexString('#FFFF99')}
        />
      </Box>

      {/* Cabin - slightly raised roof */}
      <Box
        name={`${car.id}-cabin`}
        width={width * visualScale * 0.85}
        height={height * visualScale * 0.35}
        depth={length * visualScale * 0.55}
        position={
          new Vector3(
            0,
            height * visualScale * 0.65,
            -length * visualScale * 0.05,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-cabin-material`}
          diffuseColor={carColor}
          specularColor={Color3.White()}
          specularPower={48}
        />
      </Box>

      {/* Windshield */}
      <Box
        name={`${car.id}-windshield`}
        width={width * visualScale * 0.8}
        height={height * visualScale * 0.32}
        depth={0.01}
        position={
          new Vector3(
            0,
            height * visualScale * 0.65,
            length * visualScale * 0.23,
          )
        }
        rotation={new Vector3(-Math.PI / 8, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-windshield-material`}
          diffuseColor={glassColor}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Rear window */}
      <Box
        name={`${car.id}-rear-window`}
        width={width * visualScale * 0.8}
        height={height * visualScale * 0.3}
        depth={0.01}
        position={
          new Vector3(
            0,
            height * visualScale * 0.65,
            -length * visualScale * 0.32,
          )
        }
        rotation={new Vector3(Math.PI / 9, 0, 0)}
      >
        <standardMaterial
          name={`${car.id}-rear-window-material`}
          diffuseColor={glassColor}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Side windows - left */}
      <Box
        name={`${car.id}-side-window-left`}
        width={0.01}
        height={height * visualScale * 0.25}
        depth={length * visualScale * 0.4}
        position={
          new Vector3(
            -width * visualScale * 0.43,
            height * visualScale * 0.6,
            -length * visualScale * 0.05,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-side-window-left-material`}
          diffuseColor={glassColor}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Side windows - right */}
      <Box
        name={`${car.id}-side-window-right`}
        width={0.01}
        height={height * visualScale * 0.25}
        depth={length * visualScale * 0.4}
        position={
          new Vector3(
            width * visualScale * 0.43,
            height * visualScale * 0.6,
            -length * visualScale * 0.05,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-side-window-right-material`}
          diffuseColor={glassColor}
          alpha={0.7}
          specularColor={Color3.White()}
          specularPower={128}
        />
      </Box>

      {/* Trunk */}
      <Box
        name={`${car.id}-trunk`}
        width={width * visualScale * 0.88}
        height={height * visualScale * 0.1}
        depth={length * visualScale * 0.2}
        position={
          new Vector3(
            0,
            height * visualScale * 0.35,
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

      {/* Rear bumper */}
      <Box
        name={`${car.id}-rear-bumper`}
        width={width * visualScale * 0.9}
        height={height * visualScale * 0.15}
        depth={length * visualScale * 0.1}
        position={
          new Vector3(
            0,
            height * visualScale * 0.15,
            -length * visualScale * 0.44,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-rear-bumper-material`}
          diffuseColor={accentColor}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Rear lights */}
      <Box
        name={`${car.id}-taillight-left`}
        width={width * visualScale * 0.15}
        height={height * visualScale * 0.08}
        depth={length * visualScale * 0.02}
        position={
          new Vector3(
            -width * visualScale * 0.35,
            height * visualScale * 0.3,
            -length * visualScale * 0.46,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-taillight-left-material`}
          diffuseColor={Color3.FromHexString('#FF3333')}
          emissiveColor={Color3.FromHexString('#AA0000')}
        />
      </Box>

      <Box
        name={`${car.id}-taillight-right`}
        width={width * visualScale * 0.15}
        height={height * visualScale * 0.08}
        depth={length * visualScale * 0.02}
        position={
          new Vector3(
            width * visualScale * 0.35,
            height * visualScale * 0.3,
            -length * visualScale * 0.46,
          )
        }
      >
        <standardMaterial
          name={`${car.id}-taillight-right-material`}
          diffuseColor={Color3.FromHexString('#FF3333')}
          emissiveColor={Color3.FromHexString('#AA0000')}
        />
      </Box>

      {/* Wheels - standard sedan type with rims */}
      {/* Front Left */}
      <Cylinder
        name={`${car.id}-wheel-fl`}
        height={wheelWidth}
        diameter={wheelRadius * 2}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.47,
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
        diameter={wheelRadius * 1.3}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.47,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-fl`}
          diffuseColor={Color3.FromHexString('#DDDDDD')}
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
            width * visualScale * 0.47,
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
        diameter={wheelRadius * 1.3}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.47,
            wheelRadius,
            length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-fr`}
          diffuseColor={Color3.FromHexString('#DDDDDD')}
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
            -width * visualScale * 0.47,
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
        diameter={wheelRadius * 1.3}
        segments={16}
        position={
          new Vector3(
            -width * visualScale * 0.47,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-rl`}
          diffuseColor={Color3.FromHexString('#DDDDDD')}
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
            width * visualScale * 0.47,
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
        diameter={wheelRadius * 1.3}
        segments={16}
        position={
          new Vector3(
            width * visualScale * 0.47,
            wheelRadius,
            -length * visualScale * 0.3,
          )
        }
        rotation={new Vector3(0, 0, Math.PI / 2)}
      >
        <standardMaterial
          name={`${car.id}-rim-material-rr`}
          diffuseColor={Color3.FromHexString('#DDDDDD')}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Cylinder>
    </transformNode>
  );
};
