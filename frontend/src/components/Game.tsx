import { type Car, getCarById } from '@toy-racers/shared';
import { useEffect, useState } from 'react';
import { TrackScene } from '../scenes';
import '../styles/Game.css';

// Type for race finished message
interface RaceFinishedMessage {
  players: Array<{
    id: string;
    name: string;
    carId: string;
    hasFinished: boolean;
    isOffTrack: boolean;
    finishTime?: number;
  }>;
}

// Type for GameRoom (matching the type in Lobby)
interface GameRoom {
  id: string;
  onStateChange: (callback: (state: RaceRoomState) => void) => void;
  onLeave: (callback: (code: number) => void) => void;
  onError: (callback: (code: number, message?: string) => void) => void;
  onMessage: <T>(type: string, callback: (message: T) => void) => void;
  removeAllListeners: () => void;
  leave: () => Promise<void>;
  send: (type: string, message?: unknown) => void;
}

// Type for RaceRoomState (simplified version of what's on the server)
interface RaceRoomState {
  players: Map<
    string,
    {
      id: string;
      name: string;
      isReady: boolean;
      carId: string;
      position?: { x: number; y: number; z: number };
      rotation?: { x: number; y: number; z: number };
      speed?: number;
      checkpointsPassed?: number;
      hasFinished?: boolean;
      isOffTrack?: boolean;
      finishTime?: number;
    }
  >;
  status: 'waiting' | 'ready' | 'racing' | 'finished';
  currentTime: number;
  raceStartTime: number;
}

interface GameProps {
  room: GameRoom;
  onLeave: () => void;
}

const Game = ({ room, onLeave }: GameProps) => {
  const [gameState, setGameState] = useState<RaceRoomState | null>(null);
  const [error, setError] = useState<string>('');
  const [cameraMode, setCameraMode] = useState<'third-person' | 'first-person'>(
    'third-person',
  );
  const [playerCars, setPlayerCars] = useState<Map<string, Car>>(new Map());
  const [playerId, setPlayerId] = useState<string>('');

  useEffect(() => {
    if (!room) return;

    // Set up room event listeners
    room.onStateChange((state: RaceRoomState) => {
      console.log('Game state changed:', state);
      setGameState(state);

      // Update player cars map
      const carsMap = new Map<string, Car>();
      for (const player of state.players.values()) {
        const car = getCarById(player.carId);
        if (car) {
          carsMap.set(player.carId, car);
        }
      }
      setPlayerCars(carsMap);

      // Set player ID (first time only)
      if (!playerId && state.players.size > 0) {
        // Assuming the first player is the current player
        setPlayerId(Array.from(state.players.keys())[0]);
      }
    });

    room.onError((code: number, message?: string) => {
      console.error(`Game room error: ${message} (code: ${code})`);
      setError(`Error: ${message}`);
    });

    room.onLeave((code: number) => {
      console.log(`Left game room with code ${code}`);
      onLeave();
    });

    // Listen for race finished event
    room.onMessage('race-finished', (message) => {
      console.log('Race finished:', message);
      // Handle race finished event (e.g., show results)
    });

    return () => {
      // Clean up event listeners
      room.removeAllListeners();
    };
  }, [room, onLeave, playerId]);

  // Toggle camera mode
  const toggleCameraMode = () => {
    setCameraMode((prev) =>
      prev === 'third-person' ? 'first-person' : 'third-person',
    );
  };

  if (error) {
    return (
      <div className="game-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button type="button" onClick={onLeave}>
          Leave Game
        </button>
      </div>
    );
  }

  if (!gameState) {
    return <div>Loading game state...</div>;
  }

  // Render different game states
  switch (gameState.status) {
    case 'waiting':
      return (
        <div className="game-waiting">
          <h3>Waiting for Players</h3>
          <p>Players need to get ready to start the race.</p>
        </div>
      );

    case 'ready':
      return (
        <div className="game-ready">
          <h3>Get Ready!</h3>
          <p>Race will start soon...</p>
        </div>
      );

    case 'racing': {
      // Calculate race time
      const raceTime = gameState.currentTime - gameState.raceStartTime;

      return (
        <div className="game-racing">
          <div className="race-controls">
            <button type="button" onClick={toggleCameraMode}>
              Switch to{' '}
              {cameraMode === 'third-person' ? 'First Person' : 'Third Person'}{' '}
              View
            </button>
            <div className="race-time">
              Time: {(raceTime / 1000).toFixed(1)}s
            </div>
          </div>

          {/* 3D Track Scene */}
          <div
            className="race-scene"
            style={{ width: '100%', height: '500px' }}
          >
            <TrackScene
              players={gameState.players}
              currentPlayerId={playerId}
              playerCars={playerCars}
              cameraMode={cameraMode}
            />
          </div>

          {/* Player status information */}
          <div className="player-positions">
            {Array.from(gameState.players.entries()).map(([id, player]) => (
              <div key={id} className="player-position">
                <h4>{player.name}</h4>
                {player.position && (
                  <>
                    <div>
                      Position: ({player.position.x.toFixed(1)},{' '}
                      {player.position.z.toFixed(1)})
                    </div>
                    <div>Speed: {player.speed?.toFixed(1)} m/s</div>
                    {player.checkpointsPassed && (
                      <div>Checkpoints: {player.checkpointsPassed}</div>
                    )}
                    {player.isOffTrack && (
                      <div className="off-track">Off Track!</div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'finished':
      return (
        <div className="game-finished">
          <h3>Race Finished!</h3>
          {/* Display race results */}
          <div className="race-results">
            {Array.from(gameState.players.entries())
              .sort(
                (a, b) =>
                  (a[1].finishTime ?? Number.POSITIVE_INFINITY) -
                  (b[1].finishTime ?? Number.POSITIVE_INFINITY),
              )
              .map(([id, player]) => (
                <div key={id} className="player-result">
                  <h4>{player.name}</h4>
                  {player.hasFinished ? (
                    <div>
                      Finish Time: {(player.finishTime ?? 0 / 1000).toFixed(1)}s
                    </div>
                  ) : (
                    <div>Did not finish</div>
                  )}
                </div>
              ))}
          </div>
          <button type="button" onClick={onLeave}>
            Leave Game
          </button>
        </div>
      );

    default:
      return <div>Unknown game state: {gameState.status}</div>;
  }
};

export default Game;
