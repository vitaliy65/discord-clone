import { useAppSelector } from "@/_hooks/hooks";
import { formatTime } from "@/utils/constants";
import { MessageType } from "@/_store/chat/chatSlice";
import ProfilePicture from "@/components/img-containers/profile";

export default function Message({
  message,
  drawPicture,
}: {
  message: MessageType;
  drawPicture: boolean;
}) {
  const currentUser = useAppSelector((state) => state.user.info);

  return (
    <div className="message-container">
      {/* profile picture */}
      {drawPicture ? (
        <ProfilePicture userId={message.sender} />
      ) : (
        <div className="h-8 w-8"></div>
      )}

      {/* message */}
      <div
        className={`text-message-container bg-message ${
          message.sender === currentUser.id ? "bg-sender" : ""
        }`}
      >
        {/* content of a message */}
        <p className="message-text">{message.content}</p>
        {/* time of a message */}
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
