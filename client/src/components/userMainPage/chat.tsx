import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { addMessage } from "@/_store/chat/chatSlice";

import ChatHeader from "./sections/section.chat/chat-header";
import Messages from "./sections/section.chat/messages";
import ChatInput from "./sections/section.chat/input";

export default function Chat() {
  const { chats, currentChat } = useAppSelector((state) => state.chat);
  const messages = useAppSelector((state) => state.chat.currentChatMessages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentChat) {
      const chat = chats.find((chat) => chat._id === currentChat);
      if (chat) {
        const chatContainer = document.querySelector(".messages-container");
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }
    }
  }, [currentChat, chats]);

  if (currentChat == null) {
    return (
      <main className="items-position-center w-full h-full bg-channels">
        <p className="select-chat-container bg-friends">
          Select a chat to start messaging
        </p>
      </main>
    );
  }

  return (
    <main className="chat-container bg-channels">
      <ChatHeader />
      <Messages messages={messages} />
      <ChatInput
        currentChatId={currentChat}
        saveMessageFun={async (user, message, type) => {
          await dispatch(
            addMessage({
              chatId: currentChat,
              sender: user.id,
              content: message,
              type: type,
            })
          );
        }}
      />
    </main>
  );
}
