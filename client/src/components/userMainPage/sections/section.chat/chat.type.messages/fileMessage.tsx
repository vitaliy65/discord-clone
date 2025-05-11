import { MessageType } from "@/types/types";

export default function FileMessage({
  message,
  download,
}: {
  message: MessageType;
  download: () => void;
}) {
  const fileName =
    message.content.split("/")[message.content.split("/").length - 1];

  return (
    <div onClick={download} className="file-message-container">
      <div className="flex items-center gap-2 p-2 bg-channels rounded cursor-pointer hover:bg-message">
        <img src="/chat/file.png" alt="file" className="w-6 h-6" />
        <span className="truncate">{fileName}</span>
      </div>
    </div>
  );
}
