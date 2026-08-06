import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import apiRouter from './routes/apiRouter';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/v1', apiRouter);

// Socket.IO Real-time Sepsis Telemetry Broadcasts
io.on('connection', (socket) => {
  logger.info(`Client connected to Socket.IO telemetry stream: ${socket.id}`);

  socket.on('join_ward', (wardName) => {
    socket.join(wardName);
    logger.info(`Socket ${socket.id} joined telemetry ward: ${wardName}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Export Socket.IO instance globally if needed
export { io };

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`=======================================================`);
  logger.info(` SepsisSense AI Enterprise Backend Server v3.2 ONLINE `);
  logger.info(` Listening on Port: ${PORT}                             `);
  logger.info(` Environment: ${env.NODE_ENV}                           `);
  logger.info(` API Health Check: http://localhost:${PORT}/api/v1/health`);
  logger.info(`=======================================================`);
});
