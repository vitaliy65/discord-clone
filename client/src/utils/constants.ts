export const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL as string;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

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
  console.log(mimeType);

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
