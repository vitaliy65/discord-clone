// server/sockets/chatHandler.js
import Chat from "../models/Chat.js";

export default function handleChat(io, socket) {
  // Handle sending messages
  socket.on("send_message", async ({ chatId, message, senderId }) => {
    try {
      // Save message to database
      const chat = await Chat.findById(chatId);
      if (!chat) throw new Error("Chat not found");

      const newMessage = {
        sender: senderId,
        content: message,
        timestamp: new Date(),
      };

      chat.messages.push(newMessage);
      await chat.save();

      // Emit message to all participants in chat
      chat.participants.forEach((participantId) => {
        io.to(participantId.toString()).emit("receive_message", {
          chatId,
          message: newMessage,
        });
      });
    } catch (error) {
      console.error("Message error:", error);
      socket.emit("message_error", error.message);
    }
  });

  // Join user's personal room for receiving messages
  socket.on("join_user_room", (userId) => {
    socket.join(userId);
  });
}
