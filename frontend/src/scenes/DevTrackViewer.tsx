import { Color3, Vector3 } from '@babylonjs/core';
import type { ArcRotateCamera as BabylonArcRotateCamera } from '@babylonjs/core';
import { getAllCars } from '@toy-racers/shared';
import { useRef, useState } from 'react';
import { Box, Engine, Scene, useBeforeRender, useScene } from 'react-babylonjs';
import { CarFactory } from './models/CarFactory';

/**
 * Development-only component for viewing the track without joining a race.
 * This component renders the track and a single car that can be selected from a dropdown.
 */
export const DevTrackViewer: React.FC = () => {
  const [selectedCarId, setSelectedCarId] = useState('speedster');
  const cars = getAllCars();
  const selectedCar = cars.find((car) => car.id === selectedCarId);

  // Simulated player state
  const playerState = {
    id: 'dev-player',
    position: { x: -4, y: 0.2, z: 0 }, // Near the start of the track
    rotation: { x: 0, y: Math.PI / 2, z: 0 }, // Pointed down the track
  };

  return (
    <div className="dev-track-viewer">
      <div
        className="controls"
        style={{ padding: '10px', background: '#f0f0f0' }}
      >
        <h3>Development Track Viewer</h3>
        <div>
          <label htmlFor="car-select">Select Car: </label>
          <select
            id="car-select"
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
          >
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: '10px' }}>
          <p>
            <strong>Selected Car:</strong> {selectedCar?.name}
          </p>
          <p>
            <small>{selectedCar?.description}</small>
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: 'calc(100vh - 200px)' }}>
        <Engine antialias adaptToDeviceRatio canvasId="dev-track-canvas">
          <Scene>
            {selectedCar && (
              <TrackSceneContent car={selectedCar} playerState={playerState} />
            )}
          </Scene>
        </Engine>
      </div>
    </div>
  );
};

interface TrackSceneContentProps {
  car: ReturnType<typeof getAllCars>[0]; // Type of a car from getAllCars()
  playerState: {
    id: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  };
}

const TrackSceneContent: React.FC<TrackSceneContentProps> = ({
  car,
  playerState,
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

    // Get player position
    const targetPos = new Vector3(
      playerState.position.x,
      playerState.position.y,
      playerState.position.z,
    );

    // Position the camera looking at the car from behind
    cameraRef.current.setTarget(targetPos);

    // Update camera position based on proximity to either end of the track
    let cameraOffset = new Vector3(-0.4, 0.3, -0.6); // Scaled down for smaller track

    // If near the end of the track, position camera in front
    if (playerState.position.x > TRACK_LENGTH / 2 - 0.4) {
      // Adjusted threshold
      cameraOffset = new Vector3(0.4, 0.3, -0.6);
    }

    cameraRef.current.position = new Vector3(
      targetPos.x + cameraOffset.x,
      targetPos.y + cameraOffset.y,
      targetPos.z + cameraOffset.z,
    );
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

      {/* Render car */}
      <CarFactory
        car={car}
        position={
          new Vector3(
            playerState.position.x,
            playerState.position.y,
            playerState.position.z,
          )
        }
        rotation={
          new Vector3(
            playerState.rotation.x,
            playerState.rotation.y,
            playerState.rotation.z,
          )
        }
      />
    </>
  );
};
