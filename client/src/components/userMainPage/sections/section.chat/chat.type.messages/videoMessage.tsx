import { MessageType } from "@/types/types";

export default function VideoMessage({
  message,
  download,
}: {
  message: MessageType;
  download: () => void;
}) {
  return (
    <div className="file-message-container">
      <video controls>
        <source src={message.content} />
        Your browser does not support the video element.
      </video>
      <div onClick={download}></div>
    </div>
  );
}
