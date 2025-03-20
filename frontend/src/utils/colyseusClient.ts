import { Client } from 'colyseus.js';

// Create a Colyseus client instance
// In development, connect to localhost
// In production, it would connect to the deployed server
const GAME_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-production-server.com' // This would be replaced with the actual production URL
  : 'ws://localhost:3001';

const client = new Client(GAME_SERVER_URL);

export default client;