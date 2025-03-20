# Folder Structure Document

The "Toy Racers" project adopts a monorepo architecture, leveraging pnpm and Turborepo to manage multiple packages: `frontend`, `backend`, and `shared`. This structure facilitates efficient dependency management, code sharing, and scalability. Below is the detailed folder structure with explanations of each directory's purpose.

```
toy-racers/
├── frontend/                # Front-end code (React.js + Babylon.js + TypeScript)
│   ├── public/              # Static files (e.g., index.html, favicons)
│   ├── src/                 # Source code for the front-end
│   │   ├── components/      # Reusable React components (e.g., buttons, menus)
│   │   ├── scenes/          # Babylon.js scenes (e.g., race tracks, car models)
│   │   ├── hooks/           # Custom React hooks (e.g., state management)
│   │   ├── utils/           # Helper functions (e.g., API calls, formatters)
│   │   ├── styles/          # CSS or styled-components for global styles
│   │   ├── assets/          # Images, sounds, and other media files
│   │   └── App.tsx          # Main application component
│   ├── tests/               # Unit tests for front-end components
│   ├── tsconfig.json        # TypeScript configuration for the front-end
│   ├── vite.config.js       # Vite configuration for fast builds
│   └── package.json         # Front-end dependencies and scripts
├── backend/                 # Back-end code (Node.js, Express.js, Colyseus + TypeScript)
│   ├── src/                 # Source code for the back-end
│   │   ├── api/             # Express.js routes and controllers
│   │   │   ├── routes/      # API route definitions
│   │   │   └── controllers/ # Business logic for API endpoints
│   │   ├── game/            # Colyseus room definitions and game logic
│   │   │   ├── rooms/       # Multiplayer room classes
│   │   │   └── logic/       # Game-specific logic (e.g., race management)
│   │   ├── physics/         # Cannon.js physics simulations
│   │   ├── models/          # Database models (e.g., Player, Car)
│   │   ├── utils/           # Shared utilities (e.g., authentication middleware)
│   │   └── server.ts        # Entry point for the back-end server
│   ├── tests/               # Unit tests for back-end components
│   ├── migrations/          # Database migration scripts (e.g., schema changes)
│   ├── tsconfig.json        # TypeScript configuration for the back-end
│   ├── nodemon.json         # Nodemon configuration for development
│   └── package.json         # Back-end dependencies and scripts
├── shared/                  # Shared utilities and types (TypeScript)
│   ├── src/                 # Source code for shared utilities and types
│   │   ├── types/           # Shared TypeScript types or interfaces
│   │   └── utils/           # Shared utility functions (e.g., constants, helpers)
│   ├── tests/               # Unit tests for shared code
│   ├── tsconfig.json        # TypeScript configuration for the shared package
│   └── package.json         # Shared package dependencies and scripts
├── docs/                    # Documentation (e.g., tech stack, architecture)
│   ├── tech-stack.md        # Tech stack documentation
│   ├── architecture.md      # Architecture documentation
│   └── api-docs/            # API documentation (if needed)
├── tests/                   # End-to-end tests (e.g., Cypress)
│   ├── e2e/                 # End-to-end test files
│   └── integration/         # Integration tests (if needed)
├── .github/                 # CI/CD workflows (e.g., GitHub Actions)
├── .gitignore               # Git ignore file
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── turbo.json               # Turborepo configuration for task running and caching
├── package.json             # Root package.json for managing workspaces
└── README.md                # Project overview and setup instructions
```

## Key Directories Explained
- **frontend/**: Contains all front-end code, utilizing React for UI components and Babylon.js for 3D rendering. The `src/` directory is modularized into `components/`, `scenes/`, `hooks/`, and more for clarity and reusability.
- **backend/**: Houses server-side code, with distinct subdirectories for API routes (`api/`), multiplayer game logic (`game/`), physics simulations (`physics/`), and database models (`models/`), ensuring separation of concerns.
- **shared/**: Provides reusable TypeScript types and utilities accessible to both front-end and back-end, minimizing redundancy.
- **docs/**: Stores project documentation, such as the tech stack and architecture, to onboard developers efficiently.
- **tests/**: Dedicated to end-to-end testing (e.g., Cypress), validating the integrated application experience.
- **Root Files**: Includes configuration files like `pnpm-workspace.yaml` and `turbo.json` to define the monorepo setup and automate tasks.

This structure aligns with the monorepo approach, promoting organization, scalability, and ease of navigation.
