import { useAppSelector } from "@/_hooks/hooks";
import { formatTime } from "@/utils/constants";
import { MessageType } from "@/types/types";
import { useState } from "react";
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
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const currentUser = useAppSelector((state) => state.user.info);
  const fileName =
    message.content.split("/")[message.content.split("/").length - 1];

  const handleDownload = async () => {
    try {
      // Виконуємо GET запит до URL, вказаного в message.content, для отримання файлу
      const response = await axios.get(message.content, {
        responseType: "blob", // Вказуємо, що очікуємо отримати двійковий об'єкт (blob)
      });

      // Створюємо URL для blob-об'єкта, щоб мати можливість завантажити файл
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a"); // Створюємо новий елемент <a> для завантаження
      link.href = url; // Встановлюємо атрибут href на створений URL
      link.download = fileName; // Встановлюємо атрибут download на ім'я файлу
      document.body.appendChild(link); // Додаємо елемент <a> до тіла документа
      link.click(); // Імітуємо клік на елементі <a>, щоб запустити завантаження

      // Очищення
      document.body.removeChild(link); // Видаляємо елемент <a> з документа
      window.URL.revokeObjectURL(url); // Відкликаємо URL, щоб звільнити ресурси
    } catch (error) {
      // Обробка помилок: виводимо повідомлення в консоль, якщо завантаження не вдалося
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
        return (
          <AudioMessage
            message={message}
            download={handleDownload}
            showDownloadButton={showDownloadButton}
          />
        );
      case "video":
        return (
          <VideoMessage
            message={message}
            download={handleDownload}
            showDownloadButton={showDownloadButton}
          />
        );
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
        onMouseEnter={() => setShowDownloadButton(true)}
        onMouseLeave={() => setShowDownloadButton(false)}
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
