import Chat from "../models/Chat.js";
import { config } from "dotenv";

config();

export const fileService = {
  validateUpload: async (chatId, userId) => {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    if (!chat.participants.includes(userId)) {
      throw new Error("Not authorized to upload to this chat");
    }
    return chat;
  },

  generateFileUrls: (files, chatId, userId) => {
    return files.map(
      (file) =>
        `${process.env.SERVER_URL}/api/uploads/${chatId}/${userId}/${file.filename}`
    );
  },
};
