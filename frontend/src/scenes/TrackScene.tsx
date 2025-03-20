import { Color3, Vector3 } from '@babylonjs/core';
import type { ArcRotateCamera as BabylonArcRotateCamera } from '@babylonjs/core';
import type React from 'react';
import { useRef } from 'react';
import '@babylonjs/loaders';
import type { Car } from '@toy-racers/shared';
import { Engine, Scene, useBeforeRender, useScene } from 'react-babylonjs';
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
 * Track scene component for the "Living Room Loop" track.
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
        targetPos.x,
        targetPos.y + 2,
        targetPos.z - 5,
      );
    } else if (cameraMode === 'first-person') {
      // Position the camera on the car
      cameraRef.current.setTarget(
        new Vector3(targetPos.x, targetPos.y, targetPos.z + 5),
      );
      cameraRef.current.position = new Vector3(
        targetPos.x,
        targetPos.y + 0.5,
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
        radius={10}
        target={Vector3.Zero()}
        minZ={0.1}
      />

      {/* Lights */}
      <hemisphericLight
        name="light1"
        intensity={0.7}
        direction={new Vector3(0, 1, 0)}
      />
      <directionalLight
        name="light2"
        intensity={0.5}
        direction={new Vector3(0, -1, 1)}
      />
      <pointLight
        name="light3"
        intensity={0.3}
        position={new Vector3(0, 5, 0)}
      />

      {/* Living Room Loop Track - Floor */}
      <box
        name="track-floor"
        width={20}
        height={0.1}
        depth={6}
        rotation={new Vector3(Math.PI * 0.08, 0, 0)} // Slight slope
        position={new Vector3(0, 0, 0)}
      >
        <standardMaterial
          name="track-floor-material"
          diffuseColor={Color3.FromHexString('#8B4513')} // Brown wooden floor
          specularColor={Color3.FromHexString('#553311')}
          specularPower={32}
        />
      </box>

      {/* Left wall */}
      <box
        name="track-wall-left"
        width={20}
        height={0.5}
        depth={0.1}
        position={new Vector3(0, 0.3, 3)}
        rotation={new Vector3(Math.PI * 0.08, 0, 0)} // Same slope as floor
      >
        <standardMaterial
          name="track-wall-left-material"
          diffuseColor={Color3.FromHexString('#CD853F')} // Lighter wood
        />
      </box>

      {/* Right wall */}
      <box
        name="track-wall-right"
        width={20}
        height={0.5}
        depth={0.1}
        position={new Vector3(0, 0.3, -3)}
        rotation={new Vector3(Math.PI * 0.08, 0, 0)}
      >
        <standardMaterial
          name="track-wall-right-material"
          diffuseColor={Color3.FromHexString('#CD853F')}
        />
      </box>

      {/* Start line */}
      <box
        name="start-line"
        width={6}
        height={0.01}
        depth={0.2}
        position={new Vector3(-9, 0.06, 0)}
        rotation={new Vector3(Math.PI * 0.08, 0, 0)}
      >
        <standardMaterial
          name="start-line-material"
          diffuseColor={Color3.White()}
        />
      </box>

      {/* Finish line */}
      <box
        name="finish-line"
        width={6}
        height={0.01}
        depth={0.2}
        position={new Vector3(9, -1.5, 0)} // At the bottom of the slope
        rotation={new Vector3(Math.PI * 0.08, 0, 0)}
      >
        <standardMaterial
          name="finish-line-material"
          diffuseColor={Color3.FromHexString('#FF0000')} // Red
        />
      </box>

      {/* Obstacles */}

      {/* Small bump in the middle */}
      <box
        name="obstacle-bump"
        width={3}
        height={0.2}
        depth={2}
        position={new Vector3(0, 0.05, 0)}
        rotation={new Vector3(Math.PI * 0.08, 0, 0)}
      >
        <standardMaterial
          name="obstacle-bump-material"
          diffuseColor={Color3.FromHexString('#A0522D')} // Dark brown
        />
      </box>

      {/* Random toys as obstacles */}
      <sphere
        name="obstacle-ball"
        diameter={0.8}
        position={new Vector3(4, 0.4, -1.5)}
      >
        <standardMaterial
          name="obstacle-ball-material"
          diffuseColor={Color3.FromHexString('#FF5733')} // Orange-red
        />
      </sphere>

      <box
        name="obstacle-block"
        width={0.8}
        height={0.8}
        depth={0.8}
        position={new Vector3(-5, 0.4, 1.5)}
        rotation={new Vector3(0, Math.PI / 4, 0)}
      >
        <standardMaterial
          name="obstacle-block-material"
          diffuseColor={Color3.FromHexString('#3366FF')} // Blue
        />
      </box>

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
