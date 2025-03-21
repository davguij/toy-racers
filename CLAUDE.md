# TOY RACERS DEVELOPMENT GUIDE

## Build Commands
- Root: `pnpm build` or `npx turbo run build`
- Frontend: `cd frontend && pnpm dev` (Vite dev server)
- Backend: `cd backend && pnpm dev` (Node.js server)
- Test: `pnpm test` (or per package: `cd <package> && pnpm test`)
- Lint: `pnpm lint` or `npx biome check --write .`
- Single test: `cd <package> && npx jest path/to/test.ts`

## Code Style Guidelines
- **Formatting**: Biome for linting/formatting (configured in biome.json)
- **Types**: Strong typing with TypeScript, types in `shared/src/types/`
- **Imports**: Single quotes, sorted by Biome
- **Naming**: PascalCase for components/classes, camelCase for variables/functions
- **Error handling**: Use try/catch with typed errors where appropriate
- **Package structure**: Monorepo with pnpm workspaces (frontend/backend/shared)
- **Shared code**: Import from shared package: `import { PREDEFINED_CARS } from '@toy-racers/shared'`

## Architecture
- Frontend: React + Babylon.js for 3D rendering
- Backend: Node.js, Express, Colyseus for multiplayer rooms
- Physics: Cannon.js for physics simulation