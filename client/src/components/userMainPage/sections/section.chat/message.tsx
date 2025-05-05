import { useAppSelector } from "@/_hooks/hooks";
import { formatTime } from "@/utils/constants";
import { MessageType } from "@/_store/chat/chatSlice";

export default function Message({ message }: { message: MessageType }) {
  const currentUserId = useAppSelector((state) => state.user.user.id);

  return (
    <div
      className={`message-container bg-message ${
        message.sender === currentUserId ? "bg-sender" : ""
      }`}
    >
      <p className="p-1">{message.content}</p>
      <span
        className={`message-time ${
          message.sender === currentUserId ? "text-blue-300" : "text-gray-500"
        }`}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}
