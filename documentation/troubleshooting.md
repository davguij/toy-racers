# Troubleshooting Guide

This document provides solutions for common issues encountered during development of the Toy Racers project.

## Frontend Issues

### React and react-babylonjs Compatibility Error

**Problem**: Blank screen with console error:
```
Uncaught TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')
    at $$$reconciler (react-babylonjs.js:1237:54)
```

**Cause**: Version incompatibility between React and react-babylonjs. The project requires specific versions to work correctly:
- React must be version 18.x.x (not 19.x.x)
- react-babylonjs must be version 3.1.27 to work with React 18

**Solution**:
1. Update package.json to use the correct versions:
   ```json
   "dependencies": {
     "react": "^18.2.0",
     "react-babylonjs": "^3.1.27",
     "react-dom": "^18.2.0"
   },
   "devDependencies": {
     "@types/react": "^18.2.0",
     "@types/react-dom": "^18.2.0"
   }
   ```
2. Reinstall dependencies:
   ```
   pnpm install
   ```
3. Restart the development server:
   ```
   pnpm dev
   ```

## Backend Issues

(To be added as issues are encountered)

## Deployment Issues

(To be added as issues are encountered)
