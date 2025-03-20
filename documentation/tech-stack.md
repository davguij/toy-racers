# Tech Stack Document

This document details the technologies chosen for "Toy Racers," ensuring support for 3D rendering, physics simulations, multiplayer gameplay, and scalability while keeping development efficient and accessible.

## Programming Languages

- **TypeScript**
  - **Purpose**: Provides static type checking and enhanced developer experience.
  - **Reason**: Offers better type safety and tooling support for modern JavaScript/TypeScript ecosystems.

## Front-End

- **React.js**

  - **Purpose**: Builds the user interface, including menus, car selection screens, and race HUD elements.
  - **Reason**: Its component-based structure simplifies UI development and integrates well with 3D rendering libraries like Babylon.js.

- **Babylon.js**

  - **Purpose**: Renders 3D scenes, including toy cars, tracks, and dynamic camera perspectives (first-person and third-person).
  - **Reason**: Optimized for browser-based 3D games, it provides robust tools for scene management and rendering, reducing development complexity.

- **react-babylonjs**
  - **Purpose**: Integrates Babylon.js scenes into React components.
  - **Reason**: Enables a seamless blend of UI and 3D content, enhancing the player experience.

## Back-End

- **Node.js**

  - **Purpose**: Runs server-side logic for game mechanics, API handling, and multiplayer support.
  - **Reason**: Its event-driven architecture excels in real-time applications like multiplayer games.

- **Express.js**

  - **Purpose**: Provides RESTful APIs for non-real-time tasks (e.g., player data, car selection).
  - **Reason**: Lightweight and compatible with Node.js, it streamlines API development.

- **Colyseus**

  - **Purpose**: Manages real-time multiplayer sessions, including room creation and game state synchronization.
  - **Reason**: Built for multiplayer games, it offers WebSocket communication and authoritative server logic for consistent gameplay.

- **Cannon.js**

  - **Purpose**: Simulates physics (e.g., gravity, collisions) on the server.
  - **Reason**: A lightweight physics engine that works with Node.js, ensuring uniform race outcomes across clients.

- **PostgreSQL**
  - **Purpose**: Stores persistent data like player profiles, car collections, and race stats.
  - **Reason**: A reliable relational database that scales well and integrates with Node.js.

## Networking

- **WebSocket (via Colyseus)**
  - **Purpose**: Facilitates real-time communication between clients and the server for multiplayer races.
  - **Reason**: Provides low-latency updates critical for smooth gameplay and synchronization.

## Authentication

- **Clerk**
  - **Purpose**: Handles user authentication (sign-up, log-in) and session management.
  - **Reason**: Offers secure, pre-built authentication flows that integrate easily with React.js, saving time.

## Deployment

- **Railway**
  - **Purpose**: Hosts the front-end, back-end, and database.
  - **Reason**: Simplifies deployment with support for full-stack apps and managed databases, enabling easy scaling.
