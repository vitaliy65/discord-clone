import { useAppSelector } from "@/_hooks/hooks";

export default function Messages() {
  const messages = useAppSelector((state) => state.chat.currentChatMessages);
  const currentUserId = useAppSelector((state) => state.user.user.id);

  return (
    <div className="messages-container">
      {messages &&
        messages.length > 0 &&
        messages.map((message, index) => {
          if (!message) return null;

          return (
            <div
              key={index}
              className={`message ${
                message.sender === currentUserId
                  ? "message-sender"
                  : "message-receiver"
              }`}
            >
              {message.content}
            </div>
          );
        })}
    </div>
  );
}
