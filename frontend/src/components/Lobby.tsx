import { getAllCars } from '@toy-racers/shared';
import { useCallback, useEffect, useState } from 'react';
import client from '../utils/colyseusClient';

// Type for RaceRoomState (simplified version of what's on the server)
interface RaceRoomState {
  players: Map<
    string,
    {
      id: string;
      name: string;
      isReady: boolean;
      carId: string;
    }
  >;
  status: 'waiting' | 'ready' | 'racing' | 'finished';
}

// Type for room to avoid using any
interface GameRoom {
  id: string;
  onStateChange: (callback: (state: RaceRoomState) => void) => void;
  onLeave: (callback: (code: number) => void) => void;
  leave: () => Promise<void>;
  send: (type: string, message?: unknown) => void;
}

const Lobby = () => {
  const [roomId, setRoomId] = useState<string>('');
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false);
  const [currentRoomId, setCurrentRoomId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [roomState, setRoomState] = useState<RaceRoomState | null>(null);
  const availableCars = getAllCars();

  // Select a car - using useCallback to fix dependency issues in useEffect
  const selectCar = useCallback(
    (carId: string) => {
      if (!room) return;

      setSelectedCarId(carId);
      room.send('select-car', { carId });
      console.log(`Selected car: ${carId}`);
    },
    [room],
  );

  // Set player as ready - using useCallback to fix dependency issues in useEffect
  const setPlayerReady = useCallback(() => {
    if (!room || !selectedCarId) return;

    setIsReady(true);
    room.send('ready');
    console.log('Player is ready');
  }, [room, selectedCarId]);

  // Function to create a new race room
  const createRoom = async () => {
    try {
      setIsCreating(true);
      setErrorMessage('');

      // Connect to a new race room
      const newRoom = (await client.create('race_room')) as unknown as GameRoom;

      // Update state
      setJoinedRoom(true);
      setCurrentRoomId(newRoom.id);
      setRoom(newRoom);

      // Set up room event listeners
      setupRoomListeners(newRoom);

      console.log(`Created and joined room: ${newRoom.id}`);
    } catch (error) {
      console.error('Failed to create room:', error);
      setErrorMessage('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Function to join an existing race room
  const joinRoom = async () => {
    if (!roomId.trim()) {
      setErrorMessage('Please enter a room ID.');
      return;
    }

    try {
      setIsJoining(true);
      setErrorMessage('');

      // Join an existing race room
      const newRoom = (await client.joinById(roomId)) as unknown as GameRoom;

      // Update state
      setJoinedRoom(true);
      setCurrentRoomId(newRoom.id);
      setRoom(newRoom);

      // Set up room event listeners
      setupRoomListeners(newRoom);

      console.log(`Joined room: ${newRoom.id}`);
    } catch (error) {
      console.error('Failed to join room:', error);
      setErrorMessage(
        'Failed to join room. Please check the room ID and try again.',
      );
    } finally {
      setIsJoining(false);
    }
  };

  // Set up event listeners for the room
  const setupRoomListeners = (gameRoom: GameRoom) => {
    // When state changes
    gameRoom.onStateChange((state: RaceRoomState) => {
      console.log('Room state changed:', state);
      setRoomState(state);
    });

    // When connection is closed
    gameRoom.onLeave((code: number) => {
      console.log(`Left room ${gameRoom.id} with code ${code}`);
      setJoinedRoom(false);
      setCurrentRoomId('');
      setRoom(null);
      setSelectedCarId('');
      setIsReady(false);
      setRoomState(null);
    });
  };

  // Function to leave the current room
  const leaveRoom = async () => {
    try {
      if (room) {
        await room.leave();
      }

      // Update state
      setJoinedRoom(false);
      setCurrentRoomId('');
      setRoom(null);
      setSelectedCarId('');
      setIsReady(false);
      setRoomState(null);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  // Function to copy room ID to clipboard
  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoomId);
  };

  // Handle car selection via keyboard
  const handleCarKeyPress = (event: React.KeyboardEvent, carId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      selectCar(carId);
    }
  };

  // Auto-select first car and set ready after joining (for testing)
  useEffect(() => {
    if (room && !selectedCarId && availableCars.length > 0) {
      // Add a slight delay to make sure the room is properly joined
      const timer = setTimeout(() => {
        selectCar(availableCars[0].id);

        // Set ready after another brief delay
        setTimeout(() => {
          setPlayerReady();
        }, 500);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [room, selectedCarId, availableCars, selectCar, setPlayerReady]);

  return (
    <div className="lobby">
      <h2>Race Lobby</h2>

      {!joinedRoom ? (
        <div className="lobby-actions">
          <div className="create-room">
            <h3>Create a New Room</h3>
            <button
              type="button"
              onClick={createRoom}
              disabled={isCreating}
              className="create-button"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
          </div>

          <div className="join-room">
            <h3>Join a Room</h3>
            <div className="join-input-group">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="room-id-input"
              />
              <button
                type="button"
                onClick={joinRoom}
                disabled={isJoining}
                className="join-button"
              >
                {isJoining ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      ) : (
        <div className="room-info">
          <h3>Connected to Room</h3>
          <p>
            Room ID: <span className="room-id">{currentRoomId}</span>
            <button type="button" onClick={copyRoomId} className="copy-button">
              Copy
            </button>
          </p>

          {!isReady && (
            <div className="car-selection">
              <h4>Select Your Car</h4>
              <div className="car-list">
                {availableCars.map((car) => (
                  <button
                    key={car.id}
                    className={`car-option ${selectedCarId === car.id ? 'selected' : ''}`}
                    onClick={() => selectCar(car.id)}
                    style={{
                      backgroundColor: car.color,
                      padding: '10px',
                      margin: '5px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      border:
                        selectedCarId === car.id
                          ? '2px solid black'
                          : '1px solid #ccc',
                      display: 'block',
                      width: '100%',
                    }}
                    type="button"
                  >
                    <h5>{car.name}</h5>
                    <p>{car.description}</p>
                    <div>Weight: {car.weight}</div>
                    <div>Size: {car.size}</div>
                  </button>
                ))}
              </div>

              {selectedCarId && (
                <button
                  type="button"
                  className="ready-button"
                  onClick={setPlayerReady}
                  disabled={!selectedCarId}
                >
                  I'm Ready!
                </button>
              )}
            </div>
          )}

          {isReady && (
            <div className="waiting">
              <h4>Waiting for other player to get ready...</h4>
              <div>Status: {roomState?.status || 'waiting'}</div>
            </div>
          )}

          <button type="button" onClick={leaveRoom} className="leave-button">
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default Lobby;
