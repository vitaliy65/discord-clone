import { useAppSelector } from "@/_hooks/hooks";
import { formatTime } from "@/utils/constants";
import { MessageType } from "@/types/types";
import axios from "axios";
import FileMessage from "./chat.type.messages/fileMessage";
import AudioMessage from "./chat.type.messages/audioMessage";
import ImageMessage from "./chat.type.messages/imageMessage";
import VideoMessage from "./chat.type.messages/videoMessage";
import ProfilePicture from "@/components/img-containers/profile";

export default function Message({
  message,
  drawPicture,
}: {
  message: MessageType;
  drawPicture: boolean;
}) {
  const currentUser = useAppSelector((state) => state.user.info);
  const fileName =
    message.content.split("/")[message.content.split("/").length - 1];

  const handleDownload = async () => {
    try {
      const response = await axios.get(message.content, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "file":
        return <FileMessage message={message} download={handleDownload} />;
      case "image":
        return <ImageMessage message={message} download={handleDownload} />;
      case "audio":
        return <AudioMessage message={message} download={handleDownload} />;
      case "video":
        return <VideoMessage message={message} download={handleDownload} />;
      default:
        return <p className="message-text">{message.content}</p>;
    }
  };

  return (
    <div className="message-container">
      {drawPicture ? (
        <ProfilePicture userId={message.sender} />
      ) : (
        <div className="h-8 w-8"></div>
      )}
      <div
        className={`text-message-container bg-message ${
          message.sender === currentUser.id ? "bg-sender" : ""
        }`}
      >
        {renderMessageContent()}
        <span
          className={`message-time ${
            message.sender === currentUser.id
              ? "text-blue-300"
              : "text-gray-500"
          }`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
