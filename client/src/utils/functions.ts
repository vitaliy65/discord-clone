import axios from "axios";
import { SERVER_API_URL } from "./constants";

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getFileType = (
  file: File
): "file" | "text" | "image" | "audio" | "video" => {
  const mimeType = file.type;

  // Check file type categories
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "file";
  if (
    mimeType.includes("document") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation")
  )
    return "file";

  return "file"; // Default type
};

export const handleSendFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("path", "channel-avatars");
  formData.append("files", file);

  try {
    const response = await axios.post(`${SERVER_API_URL}/upload`, formData, {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    });
    // Ensure fileUrl is always a string
    const fileUrl = response.data.urls;

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return "";
  }
};
