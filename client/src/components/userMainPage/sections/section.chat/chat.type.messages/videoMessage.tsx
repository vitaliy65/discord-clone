import { MessageType } from "@/types/types";
import { useState } from "react";
import FileDownloadButton from "./buttons/fileDownloadButton";

export default function VideoMessage({
  message,
  download,
  showDownloadButton,
}: {
  message: MessageType;
  showDownloadButton: boolean;
  download: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    Promise.resolve(download()).finally(() => {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    });
  };

  return (
    <div className="file-message-container">
      <FileDownloadButton
        show={showDownloadButton}
        handleDownload={handleDownload}
        isDownloading={isDownloading}
      />
      <video controls>
        <source src={message.content} />
        Your browser does not support the video element.
      </video>
    </div>
  );
}
