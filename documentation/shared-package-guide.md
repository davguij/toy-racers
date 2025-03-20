# Shared Package Guide

The `shared` package in Toy Racers provides common types, constants, and utilities that can be used by both the frontend and backend. This guide explains how to use and maintain the shared package.

## Architecture

The shared package is built to support both the frontend (using ESM modules) and the backend (using CommonJS modules). It accomplishes this by:

1. Compiling TypeScript code to both formats
2. Using "conditional exports" in package.json to serve the appropriate format
3. Maintaining a single source of truth for shared types and utilities

## Directory Structure

```
shared/
├── src/                 # Source code
│   ├── types/           # TypeScript types/interfaces
│   ├── constants/       # Game constants
│   └── utils/           # Shared utility functions
├── dist/                # Compiled output
│   ├── cjs/             # CommonJS modules (for backend)
│   ├── esm/             # ES modules (for frontend)
│   └── types/           # TypeScript declaration files
├── tsconfig.base.json   # Base TypeScript configuration
├── tsconfig.cjs.json    # CommonJS-specific configuration
├── tsconfig.esm.json    # ESM-specific configuration
├── tsconfig.json        # Main TypeScript configuration
└── package.json         # Package configuration with dual exports
```

## How to Import

### From Frontend (React)

The frontend will automatically use the ESM version:

```typescript
// Import types
import type { Car } from '@toy-racers/shared';

// Import constants and functions
import { PREDEFINED_CARS, getAllCars } from '@toy-racers/shared';
```

### From Backend (Node.js)

The backend will automatically use the CommonJS version:

```typescript
// Import types
import type { Car } from '@toy-racers/shared';

// Import constants and functions
import { PREDEFINED_CARS, getAllCars } from '@toy-racers/shared';
```

## Adding New Shared Code

When adding new code to the shared package:

1. Place types/interfaces in `src/types/`
2. Place constants in `src/constants/`
3. Place utility functions in `src/utils/`
4. Export everything from the appropriate file
5. Re-export from `src/index.ts` if needed

For example:

```typescript
// src/constants/tracks.ts
export interface TrackConfig {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const TRACKS: TrackConfig[] = [
  // Track definitions
];

export function getTrackById(id: string): TrackConfig | undefined {
  return TRACKS.find(track => track.id === id);
}
```

Then in `src/index.ts`:

```typescript
// Export all types
export * from './types/cars';
export * from './types/tracks';

// Export all constants and functions
export { PREDEFINED_CARS, getAllCars, getCarById } from './constants/cars';
export { TRACKS, getTrackById } from './constants/tracks';
```

## Building the Package

To build the shared package:

```bash
cd shared
pnpm build
```

This will:
1. Clean the dist directory
2. Compile TypeScript to CommonJS format
3. Compile TypeScript to ESM format
4. Generate type declaration files

## Troubleshooting

If you encounter import errors:

1. Ensure you've built the shared package (`pnpm build` in the shared directory)
2. Verify that the exports in `src/index.ts` include your desired export
3. Check that package.json exports configuration is correct
4. If changing module types, a project restart may be necessary