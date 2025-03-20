# Toy Racers - Game Design Document

## Game Overview

**Toy Racers** is a browser-based, physics-driven racing game where players select toy cars with unique attributes and watch them compete on downhill tracks. Inspired by physical toy car races, the game emphasizes strategy and spectacle over direct control. Players choose their car based on the track layout and their rival’s selection, then observe the race unfold in real-time from multiple camera angles.

Designed for players of all ages, _Toy Racers_ offers real-time multiplayer mode where two players compete in a best-of-three race series. With collectible cars, strategic depth, and accessible gameplay, it delivers a fresh and engaging racing experience.

---

## Key Features

- Physics-based racing powered by gravity, with no player control during races
- Collectible toy cars with unique attributes (weight, size, wheels, shape) that impact performance
- Strategic car selection based on track layout and rival’s car
- Real-time multiplayer: two players compete in a best-of-three series
- Multiple camera angles: first-person and third-person views
- Browser-based platform for broad accessibility
- Tracks with small walls; flying off the track eliminates a player

---

## Gameplay Mechanics

- **Objective:** Two toy cars race downhill, and the first to cross the finish line wins. If a car flies off the track, it is eliminated, and the remaining player wins.
- **Game Flow:**
  1. Each player selects a car from their collection, considering its attributes and the track layout.
  2. The race begins, simulated entirely by physics and gravity.
  3. Players watch the race in real-time, switching between camera angles.
  4. The winner is the car that finishes first or remains on the track.
- **Physics:** Realistic gravity, momentum, and collisions drive the cars’ movement.
- **Collisions:** Cars can bump into each other or the track, affecting speed and trajectory.
- **Track Risks:** Cars may fly off the track if they take turns too fast or hit obstacles. If this happens, that player is eliminated.
- **Track Elements:** Downhill slopes, turns, jumps, and obstacles create dynamic races.

---

## Car Attributes and Strategy

- **Car Attributes:** Each toy car has unique traits:
  - **Weight:** Affects momentum, jump distance, and collision impact.
  - **Size:** Influences stability and interaction with obstacles.
  - **Wheels:** Determines traction and speed on different surfaces.
  - **Shape:** Impacts aerodynamics and handling.
- **Strategic Selection:** Players choose cars based on:
  - **Track Layout:** Analyze slopes, turns, jumps, and obstacles to pick the best car.
  - **Rival’s Car:** Counter your opponent’s choice (e.g., nimble vs. heavy cars).
- **Collection:** Players unlock new cars by winning races or completing challenges.

---

## Tracks and Environments

- **MVP Track:** One downhill track for the initial release (e.g., “Living Room Loop”).
- **Future Tracks:** Additional tracks with unique layouts planned for updates.
- **Track Design:** Always downhill, with small walls to guide cars. Features include slopes, turns, jumps, and obstacles.
- **Elimination:** If a car flies off the track, that player loses the race.

---

## Multiplayer

- **Real-Time Multiplayer:**
  - Two players connect via the browser and select their cars.
  - They compete in a best-of-three race series on the same track.
  - The player whose car wins two out of three races is the overall winner.
- **Matchmaking:** Invite friends or match with random opponents.
- **Spectator Experience:** Players watch the race without control, using camera controls to switch views.

---

## User Interface

- **Main Menu:**
  - Options: Play (Multiplayer), Car Selection, Settings
- **Car Selection Screen:**
  - Players pick their car, viewing its attributes and the track layout.
- **Race UI:**
  - Displays: Race number (1/3, 2/3, 3/3), camera controls, and race timer.
  - Camera Controls: Toggle between first-person and third-person views.
- **Post-Race Screen:**
  - Shows: Race winner, series score (e.g., 1-0), options to proceed or exit.

---

## Audio and Visual Style

- **Visuals:**
  - Bright, playful graphics with detailed toy cars and imaginative tracks.
  - Dynamic camera angles for an immersive viewing experience.
- **Audio:**
  - Upbeat background music.
  - Sound effects: Rolling cars, collisions, jumps, and crowd cheers.

---

## Technical Requirements

- **Platform:** Browser-based (HTML5 and WebGL).
- **Input:** Mouse and keyboard for navigation and camera switching.
- **Graphics:** Lightweight 3D visuals optimized for browser performance.
- **Camera System:** Real-time switching between first-person and third-person views.

---

## Conclusion

_Toy Racers_ blends strategy, physics, and multiplayer competition into a unique racing experience. Players must master their car collection and outsmart their rivals, all while enjoying the excitement of gravity-driven races. With its browser-based accessibility and engaging gameplay, _Toy Racers_ is designed to captivate players of all ages.
