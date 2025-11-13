import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

io.on("connection", (socket) => {
  console.log("connected:", socket.id);
  socket.on("disconnect", () => console.log("disconnected:", socket.id));
});

const PORT = process.env.PORT ?? 5000;
server.listen(PORT, () => console.log(`listening ${PORT}`));
