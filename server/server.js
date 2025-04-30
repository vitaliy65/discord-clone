import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";

import userRoutes from "./routes/api/user.js";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// DB Config
const db = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO ===================================================================
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
// ========================================================================================

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});
app.use("/api/users", userRoutes);

// Start server
httpServer.listen(PORT, () => {
  console.log(`\nServer running on port: ${PORT}`);
  console.log(`Socket.IO server running at ${process.env.CLIENT_URL}:${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
