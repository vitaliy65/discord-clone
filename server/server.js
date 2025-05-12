import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { createServer } from "http";
import bodyParser from "body-parser";
import passport from "passport";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import initializeSocket from "./config/socket.js";
import { passportConfig } from "./config/passport.js";

// routes
import userRoutes from "./routes/api/user.js";
import friendRoutes from "./routes/api/friend.js";
import friendRequestRoutes from "./routes/api/friendRequest.js";
import channelRoutes from "./routes/api/channel.js";
import chatRoutes from "./routes/api/chat.js";
import uploadRoutes from "./routes/api/upload.js";

// Load environment variables
config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
export const io = new Server(httpServer, {
  cors: {
    origin: dev
      ? "http://localhost:5173" // 👈 клієнтський домен у режимі розробки
      : "https://discord-clone-dq4f.onrender.com", // 👈 клієнтський домен у режимі продакшн
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport config
passportConfig(passport);

// Initialize services
const startServer = async () => {
  try {
    await connectDB();
    await initializeSocket(io);

    // Routes
    app.get("/", (req, res) => {
      res.json({ message: "Server is running" });
    });
    app.use("/api/users", userRoutes);
    app.use("/api/friend", friendRoutes);
    app.use("/api/friendRequest", friendRequestRoutes);
    app.use("/api/channel", channelRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api", uploadRoutes);

    httpServer.listen(PORT, () => {
      console.log(`\nServer running on port: ${PORT}`);
      console.log(`Socket.IO server running!`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
};

startServer();
