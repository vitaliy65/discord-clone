import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { useState } from "react";
import { addMessage } from "@/_store/chat/chatSlice";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const currentChatId = useAppSelector((state) => state.chat.currentChat);
  const messagesContainer = document.querySelector(".messages-container");

  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const handleSendMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();

      // Send the message
      if (!currentChatId) return;
      await dispatch(
        addMessage({
          chatId: currentChatId,
          sender: user.id,
          content: message,
        })
      );

      // Handle sending the message
      setMessage("");

      // Scroll to the bottom of the messages container
      scrollToBottom();
    }
  };

  return (
    <div className="input-container bg-friends">
      <input
        type="text"
        value={message}
        className="chat-input-field"
        placeholder="Type your message here..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleSendMessage}
      />
    </div>
  );
}
