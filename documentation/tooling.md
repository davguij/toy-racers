# Tooling Document

The tooling for "Toy Racers" is chosen to streamline development, ensure code quality, and support deployment. Below is a comprehensive list of tools and their purposes within the project.

## Package Management
- **pnpm**: Efficiently manages dependencies across the monorepo using workspaces for the `frontend`, `backend`, and `shared` packages. Its content-addressable store reduces disk usage and speeds up installations.

## Task Runner and Build Optimization
- **Turborepo**: Manages tasks (e.g., `build`, `test`, `dev`) with caching and parallel execution, rebuilding only modified packages to accelerate workflows.

## Front-End Tools
- **React.js**: Powers the user interface, including menus, car selection, and race HUD elements.
- **Babylon.js**: Enables 3D rendering for toy cars, race tracks, and dynamic camera views.
- **Vite**: Facilitates rapid development and optimized production builds, configured via `vite.config.js` with TypeScript support.
  - **Development Proxy**: Configured to handle CORS issues during development by proxying HTTP requests (`/api`) and WebSocket connections (`/ws`) to the backend server, allowing seamless communication between the frontend (port 3000) and backend (port 3001).
- **TypeScript**: Provides type safety across the front-end, configured with a `tsconfig.json` tailored for React and modern JavaScript features.

## Back-End Tools
- **Node.js (v22)**: Executes server-side logic, leveraging its event-driven model for real-time multiplayer.
- **Express.js**: Handles RESTful APIs for tasks like player data management and car selection.
- **Colyseus**: Manages real-time multiplayer functionality, including room creation and game state synchronization.
- **Cannon.js**: Simulates server-side physics (e.g., collisions, gravity) for consistent race outcomes.
- **PostgreSQL**: Stores persistent data, such as player profiles and race statistics.
- **TypeScript**: Ensures type safety in the back-end, with a `tsconfig.json` configured for Node.js and CommonJS.
- **Nodemon**: Restarts the server automatically during development, configured via `nodemon.json`.

## Shared Module Tools
- **TypeScript**: Used for type definitions and shared utilities across frontend and backend.
- **Dual Module Compilation**: Outputs both CommonJS (for Node.js/backend) and ESM (for browser/frontend) formats to ensure cross-environment compatibility:
  - `tsconfig.base.json`: Base TypeScript configuration
  - `tsconfig.cjs.json`: CommonJS-specific configuration
  - `tsconfig.esm.json`: ESM-specific configuration
  - Package exports are configured in `package.json` to provide the correct module format depending on the environment

## Code Quality
- **ESLint**: Enforces coding standards and identifies errors in JavaScript/TypeScript code, configured for both front-end and back-end.
- **Prettier**: Maintains consistent code formatting across the project.

## Testing
- TBD

## Database Management
- **pgAdmin** or **DBeaver**: Offers a graphical interface for managing the PostgreSQL database.

## Authentication
- **Clerk**: Manages user authentication (sign-up, log-in) and sessions, integrated with React.js.

## Deployment and CI/CD
- **Railway**: Deploys the full-stack application (front-end, back-end, database), supporting long-running multiplayer processes.
- **GitHub Actions** or **Railway's CI/CD**: Automates testing, building, and deployment for reliable code updates.

## Version Control
- **Git**: Tracks code changes and supports team collaboration.
- **GitHub/GitLab**: Hosts the repository, manages issues, and streamlines pull requests.

## Miscellaneous
- **@types/node**: Supplies TypeScript type definitions for Node.js in the back-end.
- **react-babylonjs**: Bridges Babylon.js and React for seamless 3D integration in the front-end.
