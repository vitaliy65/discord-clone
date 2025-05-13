import { MessageType } from "@/types/types";
import { useEffect, useState } from "react";

export default function ImageMessage({
  message,
  download,
}: {
  message: MessageType;
  download: () => void;
}) {
  const [openPhoto, setOpenPhoto] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openPhoto) {
        setOpenPhoto(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [openPhoto]);

  const handleWheel = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 1.4);
    setScale(newScale);
  };

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
      <img
        src={message.content}
        alt="Uploaded image"
        className="message-image"
        loading="lazy"
        onClick={() => setOpenPhoto(true)}
      />
      {openPhoto && (
        <div
          className="items-position-center message-modal-image-bg"
          onClick={() => setOpenPhoto(false)}
        >
          <img
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            src={message.content}
            alt="Uploaded image"
            className="object-contain"
            loading="lazy"
            style={{ transform: `scale(${scale})` }}
          />
          <button
            className="message-modal-download-button bg-clicked hover:bg-custom-focus"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            {isDownloading ? (
              <div className="scalable-loading-spinner"></div>
            ) : (
              <img
                src="/chat/download.png"
                alt="download image"
                height={128}
                width={128}
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
