import http from 'node:http';
import express from 'express';
import { Server } from 'colyseus';
import { RaceRoom } from './game/rooms/RaceRoom';

// Create Express app
const app = express();
const port = Number(process.env.PORT) || 3001;

// Middleware
app.use(express.json());

// API routes
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Create HTTP server and initialize Colyseus
const httpServer = http.createServer(app);
const gameServer = new Server({
  server: httpServer,
});

// Register RaceRoom
gameServer.define('race_room', RaceRoom);

// Start the server
httpServer.listen(port, () => {
  console.log(`🏎️ Toy Racers server running on http://localhost:${port}`);
});

console.log('🎮 Colyseus server ready for connections');