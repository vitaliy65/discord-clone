import { useAppSelector } from "@/_hooks/hooks";
import Message from "./message";
import { useEffect, useState } from "react";

export default function Messages() {
  const messages = useAppSelector((state) => state.chat.currentChatMessages);
  const currentUserId = useAppSelector((state) => state.user.user.id);
  const [windowWidthLessLG, setWindowWidthLessLG] = useState(
    window.innerWidth < 1024
  ); // 1024px is Tailwind's lg breakpoint

  useEffect(() => {
    const chatContainer = document.querySelector(".messages-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    const handleResize = () => {
      setWindowWidthLessLG(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [messages]); // Run effect when messages array changes

  return (
    <ul className="messages-container">
      {messages &&
        messages.length > 0 &&
        messages.map((message, index, self) => {
          let drawPiscture = false;

          if (index + 1 < self.length) {
            if (message.sender != self[index + 1].sender) {
              drawPiscture = true;
            }
          } else {
            drawPiscture = true;
          }

          if (windowWidthLessLG && message.sender === currentUserId)
            drawPiscture = false;

          return (
            <li
              key={index}
              className={`${
                message.sender === currentUserId
                  ? "message-sender"
                  : "message-receiver"
              }`}
            >
              <Message message={message} drawPicture={drawPiscture} />
            </li>
          );
        })}
    </ul>
  );
}
