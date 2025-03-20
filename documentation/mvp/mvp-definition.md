# Toy Racers - MVP Definition

Below is the definition of the Minimum Viable Product (MVP) for "Toy Racers," a browser-based, physics-driven racing game. The MVP is designed to deliver the core gameplay experience—strategic car selection and real-time multiplayer racing—while keeping development efficient and focused on validating the game’s concept with real users. This definition is based on the provided documentation, including the Game Design Document, Tech Stack Document, Architecture Document, Folder Structure Document, and Tooling Document.

---

## Overview

The MVP for "Toy Racers" focuses on enabling two players to compete in a best-of-three race series on a single track. Players select toy cars with unique attributes and watch the physics-driven races unfold in real-time, switching between camera views. The goal is to test the core mechanics—strategy in car selection, physics-based racing, and multiplayer functionality—while providing a functional and engaging experience. Simplifications are made to streamline development, with additional features planned for future iterations.

---

## MVP Features

### 1. Authentication
- **Description**: Players can sign up and log in to participate in races.
- **Implementation**:
  - Uses Clerk for secure user authentication and session management.
  - Provides basic user profiles (e.g., username, email) stored via Clerk.
- **Purpose**: Ensures players have unique identities for multiplayer sessions.

### 2. Multiplayer Lobby
- **Description**: Players can create or join a race room to compete with another player.
- **Implementation**:
  - Players create a race room via Colyseus, receiving a unique room code or shareable link.
  - Players join an existing room using the code or link.
  - Once two players are in the room, they proceed to car selection.
- **Purpose**: Facilitates real-time two-player races with a simple matchmaking system.

### 3. Car Selection
- **Description**: Players choose a car from a fixed set of options, each with unique attributes.
- **Implementation**:
  - A predefined set of 3-4 cars (e.g., heavy, light, high-traction) is available to all players.
  - Attributes (e.g., weight, size, wheels) are stored in PostgreSQL and affect physics simulation.
  - Car selection screen displays each car’s attributes for strategic decision-making.
- **Purpose**: Tests the strategic core of the game without requiring a collection or unlocking system.

### 4. Race Simulation
- **Description**: Races are simulated using physics, with outcomes determined by car attributes and track layout.
- **Implementation**:
  - Server-side simulation using Cannon.js for gravity, momentum, and collisions.
  - Colyseus broadcasts game state updates (e.g., car positions) to clients every 50ms.
  - Clients render the race in 3D using Babylon.js, updating visuals based on server data.
  - Race ends when a car crosses the finish line or flies off the track.
- **Purpose**: Delivers the physics-driven racing experience central to the game.

### 5. Camera Views
- **Description**: Players can switch between two camera perspectives during the race.
- **Implementation**:
  - **Third-person view**: Camera follows the player’s car from behind.
  - **First-person view**: Camera is attached to the player’s car.
  - Switching is handled locally on the client using Babylon.js.
- **Purpose**: Enhances the spectator experience with dynamic viewing options.

### 6. Best-of-Three Series
- **Description**: Players compete in a series of three races, with the overall winner determined by the best score.
- **Implementation**:
  - Colyseus manages the series within a single room, tracking wins in memory.
  - After each race, the server determines the winner and updates the series score (e.g., 1-0).
  - The first player to win two races is declared the overall winner.
- **Purpose**: Provides a competitive multiplayer structure to test engagement.

### 7. User Interface
- **Description**: A minimal but functional UI supports the gameplay flow.
- **Implementation**:
  - **Login/Signup Screen**: Managed by Clerk for authentication.
  - **Main Menu**: Options to “Play” (create or join a race).
  - **Car Selection Screen**: Displays car options and attributes.
  - **Race Screen**: Shows the 3D race, camera controls, race number (1/3, 2/3, 3/3), and series score.
  - **Post-Race Screen**: Displays the race winner and updated series score.
  - **Series End Screen**: Shows the overall winner with options to play again or exit.
  - Built with React.js and styled minimally for functionality.
- **Purpose**: Ensures players can navigate and interact with the game seamlessly.

### 8. Track
- **Description**: A single downhill track is used for all races.
- **Implementation**:
  - Predefined track (“Living Room Loop”) with slopes, turns, and small walls.
  - Hardcoded track geometry in Cannon.js for server simulation.
  - Flying off the track eliminates a player, with the server detecting this event.
- **Purpose**: Provides a consistent environment to test gameplay mechanics.

### 9. Deployment
- **Description**: The game is accessible via browser with all components hosted together.
- **Implementation**:
  - Deployed on Railway as a full-stack application (front-end, back-end, database).
  - Supports WebSocket connections for real-time multiplayer via Colyseus.
- **Purpose**: Ensures broad accessibility and validates the tech stack in a live environment.

---

## Simplifications and Assumptions
To keep the MVP lean and focused, the following simplifications are made:
- **Car Collection**: All players share the same fixed set of cars; no unlocking or player-specific collections are implemented.
- **Track**: Limited to one track (“Living Room Loop”) to reduce development scope.
- **Multiplayer**: Restricted to two-player races with a basic lobby system; no advanced matchmaking or random opponent pairing.
- **Physics**: Uses basic physics simulation with simplified car attribute effects (e.g., weight as mass, wheels as friction).
- **UI**: Prioritizes functionality over polished aesthetics.
- **Database**: Stores car attributes and relies on Clerk for user data; no persistent race history or leaderboards.
- **Disconnections**: If a player disconnects, the other wins the series by default.

These simplifications allow the MVP to focus on validating the core concept while leaving room for future enhancements like additional tracks, car customization, and progression systems.

---

## User Flow
1. **Login**: Player signs up or logs in using Clerk.
2. **Main Menu**: Player selects “Play” to enter multiplayer mode.
3. **Lobby**:
   - Player creates a race room and shares the room code/link, or joins an existing room.
   - Once two players are connected, they proceed to car selection.
4. **Car Selection**: Each player picks a car from the available options.
5. **Race Series**:
   - The server starts the first race, simulating physics and updating clients.
   - Players watch the race, switching between camera views.
   - After each race, the winner is announced, and the series score updates.
   - Steps 4-5 repeat for three races.
6. **Series End**: The overall winner is declared, and players can play again or exit.

---

## Conclusion
This MVP for "Toy Racers" delivers a focused, playable version of the game that tests its core value proposition: strategic car selection and physics-driven multiplayer racing. By implementing essential features—authentication, a simple lobby, car selection, race simulation, camera views, and a best-of-three series—on a single track, it provides a foundation for gathering user feedback and iterating toward a full release. The use of the specified tech stack ensures efficient development and scalability, aligning with the game’s browser-based, accessible design.
