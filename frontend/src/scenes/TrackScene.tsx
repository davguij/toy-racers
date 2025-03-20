import { Color3, Vector3 } from '@babylonjs/core';
import type { ArcRotateCamera as BabylonArcRotateCamera } from '@babylonjs/core';
import type React from 'react';
import { useRef } from 'react';
import '@babylonjs/loaders';
import type { Car } from '@toy-racers/shared';
import { Box, Engine, Scene, useBeforeRender, useScene } from 'react-babylonjs';
import { CarFactory } from './models/CarFactory';

interface PlayerState {
  id: string;
  name: string;
  carId: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  isOffTrack?: boolean;
  hasFinished?: boolean;
}

interface TrackSceneProps {
  players: Map<string, PlayerState>;
  currentPlayerId: string;
  playerCars: Map<string, Car>;
  cameraMode?: 'third-person' | 'first-person';
}

/**
 * Track scene component for a simple blue plastic track.
 * Renders the track and cars based on player states.
 */
export const TrackScene: React.FC<TrackSceneProps> = ({
  players,
  currentPlayerId,
  playerCars,
  cameraMode = 'third-person',
}) => {
  // Create an array of player entries for rendering
  const playerEntries = Array.from(players.entries());

  return (
    <Engine antialias adaptToDeviceRatio canvasId="track-canvas">
      <Scene>
        <TrackSceneContent
          players={players}
          currentPlayerId={currentPlayerId}
          playerCars={playerCars}
          cameraMode={cameraMode}
          playerEntries={playerEntries}
        />
      </Scene>
    </Engine>
  );
};

interface TrackSceneContentProps extends TrackSceneProps {
  playerEntries: [string, PlayerState][];
}

// Separate component to use hooks inside the Scene
const TrackSceneContent: React.FC<TrackSceneContentProps> = ({
  players,
  currentPlayerId,
  playerCars,
  cameraMode,
  playerEntries,
}) => {
  // Get the Babylon.js scene
  const scene = useScene();
  const cameraRef = useRef<BabylonArcRotateCamera>(null);

  // Track dimensions (matching backend PhysicsWorld.ts)
  const TRACK_LENGTH = 2.0; // 2 meters long (scaled down for toy size)
  const TRACK_WIDTH = 0.15; // 15 cm wide (approx width of a Hot Wheels track)
  const TRACK_SLOPE = Math.atan(0.15); // 15% slope in radians

  // Track colors
  const TRACK_COLOR = Color3.FromHexString('#3399FF'); // Blue plastic color
  const BARRIER_COLOR = Color3.FromHexString('#2277DD'); // Slightly darker blue for barriers
  const START_LINE_COLOR = Color3.White(); // White for start line
  const FINISH_LINE_COLOR = Color3.FromHexString('#FF0000'); // Red for finish line

  // Before render callback to update camera position
  useBeforeRender(() => {
    if (!scene || !cameraRef.current) return;

    // Find current player
    const currentPlayer = players.get(currentPlayerId);
    if (!currentPlayer || !currentPlayer.position) return;

    // Get player position
    const targetPos = new Vector3(
      currentPlayer.position.x,
      currentPlayer.position.y,
      currentPlayer.position.z,
    );

    // Set camera target based on mode
    if (cameraMode === 'third-person') {
      // Position the camera behind the car
      cameraRef.current.setTarget(targetPos);
      cameraRef.current.position = new Vector3(
        targetPos.x - 0.4,
        targetPos.y + 0.2,
        targetPos.z - 0.6,
      );
    } else if (cameraMode === 'first-person') {
      // Position the camera on the car
      cameraRef.current.setTarget(
        new Vector3(targetPos.x + 0.6, targetPos.y, targetPos.z),
      );
      cameraRef.current.position = new Vector3(
        targetPos.x,
        targetPos.y + 0.05,
        targetPos.z,
      );
    }
  });

  return (
    <>
      {/* Camera */}
      <arcRotateCamera
        name="camera"
        ref={cameraRef}
        alpha={Math.PI / 2}
        beta={Math.PI / 4}
        radius={5}
        target={Vector3.Zero()}
        minZ={0.1}
      />

      {/* Directional Light for good visibility */}
      <directionalLight
        name="light"
        direction={new Vector3(0, -1, 0.5)}
        intensity={0.8}
        position={new Vector3(0, 10, -10)}
      />

      {/* Ambient light to prevent total darkness */}
      <hemisphericLight
        name="ambient"
        intensity={0.3}
        direction={new Vector3(0, 1, 0)}
      />

      {/* Main track surface - blue plastic */}
      <Box
        name="track-surface"
        width={TRACK_LENGTH}
        height={0.01}
        depth={TRACK_WIDTH}
        rotation={new Vector3(TRACK_SLOPE, 0, 0)}
        position={new Vector3(0, 0, 0)}
      >
        <standardMaterial
          name="track-material"
          diffuseColor={TRACK_COLOR}
          specularColor={Color3.White()}
          specularPower={64}
        />
      </Box>

      {/* Left barrier */}
      <Box
        name="left-barrier"
        width={TRACK_LENGTH}
        height={0.03}
        depth={0.01}
        rotation={new Vector3(TRACK_SLOPE, 0, 0)}
        position={new Vector3(0, 0.015, -TRACK_WIDTH / 2 - 0.005)}
      >
        <standardMaterial
          name="left-barrier-material"
          diffuseColor={BARRIER_COLOR}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Right barrier */}
      <Box
        name="right-barrier"
        width={TRACK_LENGTH}
        height={0.03}
        depth={0.01}
        rotation={new Vector3(TRACK_SLOPE, 0, 0)}
        position={new Vector3(0, 0.015, TRACK_WIDTH / 2 + 0.005)}
      >
        <standardMaterial
          name="right-barrier-material"
          diffuseColor={BARRIER_COLOR}
          specularColor={Color3.White()}
          specularPower={32}
        />
      </Box>

      {/* Start line */}
      <Box
        name="start-line"
        width={0.02}
        height={0.005}
        depth={TRACK_WIDTH}
        rotation={new Vector3(TRACK_SLOPE, 0, 0)}
        position={new Vector3(-TRACK_LENGTH / 2 + 0.2, 0.006, 0)}
      >
        <standardMaterial
          name="start-line-material"
          diffuseColor={START_LINE_COLOR}
          emissiveColor={Color3.FromHexString('#DDDDDD')}
        />
      </Box>

      {/* Finish line */}
      <Box
        name="finish-line"
        width={0.02}
        height={0.005}
        depth={TRACK_WIDTH}
        rotation={new Vector3(TRACK_SLOPE, 0, 0)}
        position={new Vector3(TRACK_LENGTH / 2 - 0.2, 0.006, 0)}
      >
        <standardMaterial
          name="finish-line-material"
          diffuseColor={FINISH_LINE_COLOR}
          emissiveColor={Color3.FromHexString('#880000')}
        />
      </Box>

      {/* Render all player cars */}
      {playerEntries.map(([id, player]) => {
        const car = playerCars.get(player.carId);
        if (!car || !player.position) return null;

        return (
          <CarFactory
            key={id}
            car={car}
            position={
              new Vector3(
                player.position.x,
                player.position.y,
                player.position.z,
              )
            }
            rotation={
              player.rotation
                ? new Vector3(
                    player.rotation.x,
                    player.rotation.y,
                    player.rotation.z,
                  )
                : undefined
            }
          />
        );
      })}
    </>
  );
};
