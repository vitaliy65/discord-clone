import { MessageType } from "@/types/types";

export default function ImageMessage({
  message,
  download,
}: {
  message: MessageType;
  download: () => void;
}) {
  return (
    <div className="file-message-container">
      <img
        src={message.content}
        alt="Uploaded image"
        className="max-w-md max-h-60 object-contain"
        loading="lazy"
        onClick={download}
      />
      <div onClick={download}></div>
    </div>
  );
}
