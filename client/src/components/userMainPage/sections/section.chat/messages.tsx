import { useAppSelector } from "@/_hooks/hooks";
import Message from "./message";
import { useEffect } from "react";

export default function Messages() {
  const messages = useAppSelector((state) => state.chat.currentChatMessages);
  const currentUserId = useAppSelector((state) => state.user.user.id);

  useEffect(() => {
    const chatContainer = document.querySelector(".messages-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]); // Run effect when messages array changes

  return (
    <ul className="messages-container">
      {messages &&
        messages.length > 0 &&
        messages.map((message, index) => {
          if (!message) return null;

          return (
            <li
              key={index}
              className={`${
                message.sender === currentUserId
                  ? "message-sender"
                  : "message-receiver"
              }`}
            >
              <Message message={message} />
            </li>
          );
        })}
    </ul>
  );
}
