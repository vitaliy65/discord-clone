import { fileService } from "../services/fileService.js";
import Chat from "../models/Chat.js";
import path from "path";
import fs from "fs";

export const handleFileUpload = async (req, res) => {
  try {
    const chatId = req.body.chatId;
    await fileService.validateUpload(chatId, req.user.id);

    const fileUrls = fileService.generateFileUrls(
      req.files,
      chatId,
      req.user.id
    );
    res.json(fileUrls);
  } catch (error) {
    console.error(error);
    res
      .status(error.message === "Chat not found" ? 404 : 500)
      .json({ error: error.message });
  }
};

export const handleFileGet = async (req, res) => {
  try {
    const { chatId, userId, filename } = req.params;

    // Resolve absolute file path
    const filePath = path.join(
      process.cwd(),
      "uploads",
      chatId,
      userId,
      filename
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Send file with proper content type
    res.sendFile(filePath);
  } catch (error) {
    console.error("File access error:", error);
    res.status(500).json({ error: "Error accessing file" });
  }
};
