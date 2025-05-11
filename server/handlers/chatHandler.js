import Chat from "../models/Chat.js";

export default async function handleChat({
  chatId,
  content,
  type,
  senderId,
  socket,
  io,
}) {
  // Handle sending messages
  try {
    // Save message to database
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat not found");

    const newMessage = {
      sender: senderId,
      content: content,
      type: type,
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
}
