# Implementation Plan for "Toy Racers" MVP

## Phase 1: Core Game Setup

### Step 1: Define Car Attributes in the Shared Package
- **User Story**: As a developer, I need to define the car attributes in the shared package so that both the front-end and back-end can use them consistently.
- **Task**: In the shared package, create a file that defines a car type and a list of predefined cars with attributes like weight, size, and wheels.
- **Test**: Manually check that the list contains at least 3 cars and that each car has all required attributes (e.g., weight, size, wheels) defined.

### Step 2: Set Up a Basic Multiplayer Room in the Back-End
- **User Story**: As a player, I need a server to create a race room so that I can compete with another player in real-time.
- **Task**: In the back-end, set up a Colyseus server with a race room class that allows players to join and leave, logging their actions.
- **Test**: Start the back-end server and manually verify that it runs without errors and logs when players join or leave a room.

### Step 3: Create a Lobby in the Front-End to Join a Room
- **User Story**: As a player, I need a simple lobby interface to create or join a race room so I can start playing with another player.
- **Task**: In the front-end, create a lobby component that lets players create a room (displaying a room ID) or join a room by entering a room ID.
- **Test**: Open two browser windows, create a room in one, join it from the other using the room ID, and verify both clients connect to the same room by displaying a success message.

## Phase 2: Race Simulation Basics

### Step 4: Add Advanced Physics to the Race Room
- **User Story**: As a player, I need the server to simulate a realistic race so that I can see cars move on a track with accurate physics.
- **Task**: In the back-end race room, set up an advanced physics simulation with a sloped track and two car objects that move downhill due to gravity, incorporating basic collision mechanics (without car deformation), friction differences based on car attributes, and gravity effects. Broadcast positions and orientations to clients.
- **Test**: Join the room with two clients and manually verify that the server logs show the cars' positions changing as they move down the slope, with realistic physics interactions.

### Step 5: Create 3D Models for Cars and Track
- **User Story**: As a player, I need visually distinct cars and a clean track to enhance the racing experience.
- **Task**: Develop 3D models for at least 3 different toy cars with unique visual characteristics corresponding to their physical attributes, and create a simple blue plastic track with small barriers, a 15% slope, and clearly marked start and finish lines.
- **Test**: Review the 3D models to ensure they are visually appropriate, properly scaled, and match their defined physical attributes. Verify that the track is clean, minimalist, and provides a clear racing path.

### Step 6: Render the Race in the Front-End
- **User Story**: As a player, I need to see the race happen in 3D so that I can watch my car compete.
- **Task**: In the front-end, create a race scene component that renders the track and car objects, updating their positions based on server updates.
- **Test**: Connect two clients to a room, start the race, and manually verify that both clients display the cars moving down the slope in sync with the server's updates.

## Phase 3: Car Selection and Race Logic

### Step 7: Enable Car Selection Before the Race
- **User Story**: As a player, I need to pick my car before the race starts so that I can strategize based on its attributes.
- **Task**: Add a car selection screen in the front-end to choose from the predefined cars and send the choice to the server; update the back-end room to wait until both players select cars before starting the race.
- **Test**: Join a room with two clients, have each select a different car, and verify that the race only starts after both selections are made, with the server logging the chosen cars.

### Step 8: Simulate a Single Race with a Winner
- **User Story**: As a player, I need the race to end with a clear winner so that I know who performed better.
- **Task**: In the back-end, define a finish line on the track and end the race when a car crosses it or flies off, broadcasting the winner to clients; display the result in the front-end.
- **Test**: Run a race with two clients, ensure one car crosses the finish line or flies off, and verify that both clients display the same winner.

## Phase 4: Multi-Race Series

### Step 9: Implement a Best-of-Three Series
- **User Story**: As a player, I need to compete in a best-of-three series so that I can have a longer, more competitive experience.
- **Task**: In the back-end, track wins across three races, restarting after each race until a player wins two; update the front-end to show the series score and final winner.
- **Test**: Play a full series with two clients, ensuring the score updates (e.g., 1-0, 1-1, 2-1) and the series ends with a winner displayed after two wins.

### Step 10: Handle Player Disconnections
- **User Story**: As a player, I want the race to continue even if my opponent disconnects, so that I can still see the outcome.
- **Task**: Implement disconnection detection in the race room and ensure races continue to completion regardless of player connection status. Allow disconnected players to miss race results without affecting the race simulation.
- **Test**: During a race, simulate a player disconnection and verify that the race continues to completion and results are broadcast normally.

## Phase 5: Enhanced Viewing Experience

### Step 11: Add Camera Switching During the Race
- **User Story**: As a player, I need to switch between camera views so that I can enjoy watching the race from different angles.
- **Task**: In the front-end race scene, add controls to toggle between a third-person view (behind the player's car) and a first-person view (on the car), identifying the player's car by their room position.
- **Test**: During a race, use the controls in one client to switch views and verify that the camera follows the correct car in both third-person and first-person perspectives.

## Phase 6: Authentication (Final MVP Step)

### Step 12: Integrate Basic Authentication
- **User Story**: As a player, I need to log in to play the game so that my identity is secure and tied to my races.
- **Task**: In the front-end, add login and signup screens using Clerk; in the back-end, require a valid authentication token to join rooms or access features.
- **Test**: Attempt to join a room without logging in (should fail), then log in with two clients and verify both can join a room successfully.

**Notes**:
- No specific deadlines or dependencies are defined for the implementation phases.
- Car data and track information will remain hardcoded for the MVP, with no database storage needed.
- Testing will be performed manually for each feature without automated tests.
- UI design will be developed iteratively during implementation with a focus on simplicity and functionality rather than visual polish. Design decisions will be reviewed during the implementation process.
- 3D models for cars and tracks will be developed during the implementation process.
- Basic collision mechanics will be used instead of complex deformation physics to keep the game casual and performant.
