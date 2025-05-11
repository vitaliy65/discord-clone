import { MessageType } from "@/types/types";

export default function AudioMessage({
  message,
  download,
}: {
  message: MessageType;
  download: () => void;
}) {
  return (
    <div className="file-message-container">
      <audio controls className="max-w-md">
        <source src={message.content} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
