import { useState } from 'react';
import client from '../utils/colyseusClient';

// Type for RaceRoomState (simplified version of what's on the server)
interface RaceRoomState {
  players: Map<string, {
    id: string;
    name: string;
    isReady: boolean;
    carId: string;
  }>;
  status: 'waiting' | 'ready' | 'racing' | 'finished';
}

// Type for room to avoid using any
interface GameRoom {
  id: string;
  onStateChange: (callback: (state: RaceRoomState) => void) => void;
  onLeave: (callback: (code: number) => void) => void;
  leave: () => Promise<void>;
}

const Lobby = () => {
  const [roomId, setRoomId] = useState<string>('');
  const [joinedRoom, setJoinedRoom] = useState<boolean>(false);
  const [currentRoomId, setCurrentRoomId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  // Function to create a new race room
  const createRoom = async () => {
    try {
      setIsCreating(true);
      setErrorMessage('');

      // Connect to a new race room
      const room = await client.create('race_room') as unknown as GameRoom;

      // Update state
      setJoinedRoom(true);
      setCurrentRoomId(room.id);

      // Set up room event listeners
      setupRoomListeners(room);

      console.log(`Created and joined room: ${room.id}`);
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
      const room = await client.joinById(roomId) as unknown as GameRoom;

      // Update state
      setJoinedRoom(true);
      setCurrentRoomId(room.id);

      // Set up room event listeners
      setupRoomListeners(room);

      console.log(`Joined room: ${room.id}`);
    } catch (error) {
      console.error('Failed to join room:', error);
      setErrorMessage('Failed to join room. Please check the room ID and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Set up event listeners for the room
  const setupRoomListeners = (room: GameRoom) => {
    // When another player joins the room
    room.onStateChange((state: RaceRoomState) => {
      console.log('Room state changed:', state);
    });

    // When connection is closed
    room.onLeave((code: number) => {
      console.log(`Left room ${room.id} with code ${code}`);
      setJoinedRoom(false);
      setCurrentRoomId('');
    });
  };

  // Function to leave the current room
  const leaveRoom = async () => {
    try {
      // Find the room in the client's joined rooms and leave it
      const rooms = client.rooms as unknown as GameRoom[];
      for (const room of rooms) {
        if (room.id === currentRoomId) {
          await room.leave();
          break;
        }
      }

      // Update state
      setJoinedRoom(false);
      setCurrentRoomId('');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  // Function to copy room ID to clipboard
  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoomId);
  };

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

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
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
          <p className="success-message">
            Successfully connected! Share this room ID with another player.
          </p>
          <button type="button" onClick={leaveRoom} className="leave-button">
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default Lobby;