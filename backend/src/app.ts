import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import { setupSwagger } from "./swagger";
import msgsRouter from "./routes/msgs.routes";
import path from "path";

const app = express();
const server = http.createServer(app);

// Use persistent volume for SQLite or fallback to local
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/data/dev.db' 
  : path.join(__dirname, '../prisma/dev.db');

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"].filter(Boolean),
  credentials: true,
}));

// Routes
app.use("/api", msgsRouter);
setupSwagger(app);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    websockets: true,
    database: "SQLite",
    environment: process.env.NODE_ENV || "development"
  });
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("chat message", (data) => {
    console.log("Message received:", data);
    // Broadcast to all clients
    io.emit("chat message", data);
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} with WebSocket support`);
  console.log(`📊 SQLite path: ${dbPath}`);
});