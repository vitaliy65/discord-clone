import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { socket } from "@/utils/socket";
import { addMessage } from "@/_store/chat/chatSlice";

export default function Chat() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.user);
  const currentChat = useAppSelector((state) => state.chat);
  const messages = useAppSelector((state) =>
    currentChat ? state.chat.messages[currentChat._id] : []
  );

  useEffect(() => {
    // Join user's room for receiving messages
    socket.emit("join_user_room", currentUser.id);

    // Listen for new messages
    socket.on("receive_message", (data) => {
      dispatch(addMessage(data));
    });

    return () => {
      socket.off("receive_message");
    };
  }, [dispatch, currentUser.id]);

  const sendMessage = (message: string) => {
    if (!currentChat) return;

    socket.emit("send_message", {
      chatId: currentChat._id,
      message,
      senderId: currentUser.id,
    });
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === currentUser.id ? "sent" : "received"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      {/* Add your message input component here */}
    </div>
  );
}
