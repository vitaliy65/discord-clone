import { fileService } from "../services/fileService.js";
import { uploadFiles } from "../config/storage.js";

export const handleFileUpload = async (req, res) => {
  try {
    const chatId = req.body.chatId;
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const fileOutputPaths = fileService.generateFileUrls(
      req.files,
      chatId,
      userId
    );
    const uploadedUrls = await uploadFiles(req.files, fileOutputPaths);

    res.json({ urls: uploadedUrls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const handleFileGet = async (req, res) => {
  try {
    const { chatId, userId, filename } = req.params;

    // Construct storage path
    const storagePath = `${chatId}/${userId}/${filename}`;

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/${storagePath}`;

    res.json({ url: publicUrl });
  } catch (error) {
    console.error("File access error:", error);
    res.status(500).json({ error: "Error accessing file" });
  }
};
