import { io } from "socket.io-client";
import { SERVER_API_URL } from "./constants";

// Create socket instance
export const socket = io(SERVER_API_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Add event listeners
socket.on("connect", () => {
  console.log("Connected to socket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});
