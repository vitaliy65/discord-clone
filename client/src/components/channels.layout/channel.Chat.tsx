import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import ChatInput from "../userMainPage/sections/section.chat/input";
import { ChannelTextChatType, ChannelVoiceChatType } from "@/types/types";
import Messages from "../userMainPage/sections/section.chat/messages";
import { addMessageToCurrentChat } from "@/_store/channel/channelSlice";

export default function ChannelChat() {
  const currentChat = useAppSelector((s) => s.channel.currentChat);
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);
  const dispatch = useAppDispatch();

  // Return early if no chat selected
  if (!currentChat) {
    return (
      <div className="items-position-center h-full bg-friends">
        <p className="px-4 py-2 bg-channels rounded-full shadow-sm">
          Select chat to start messaging!
        </p>
      </div>
    );
  }

  // Type guard without state updates
  const isTextChat = (
    chat: ChannelTextChatType | ChannelVoiceChatType
  ): chat is ChannelTextChatType => {
    return "messages" in chat;
  };

  // text chat section
  return isTextChat(currentChat) ? (
    <main className="chat-container bg-friends">
      <Messages messages={currentChat.messages} />
      <ChatInput
        currentChatId={currentChat._id}
        saveMessageFun={async (user, message, type) => {
          if (currentChannel) {
            await dispatch(
              addMessageToCurrentChat({
                channelId: currentChannel._id,
                chatId: currentChat._id,
                sender: user.id,
                content: message,
                type: type,
              })
            );
          }
        }}
      />
    </main>
  ) : (
    <main></main>
  );
}
