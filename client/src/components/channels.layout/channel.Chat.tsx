import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import ChatInput from "../userMainPage/sections/section.chat/input";
import Messages from "../userMainPage/sections/section.chat/messages";
import { addMessageToCurrentChat } from "@/_store/channel/channelSlice";
import { BottomPanel } from "./voiceChat/bottom-panel";

export default function ChannelChat() {
  const currentTextChat = useAppSelector((s) => s.channel.currentTextChat);
  const currentVoiceChat = useAppSelector((s) => s.channel.currentVoiceChat);
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);
  const dispatch = useAppDispatch();

  // Return early if no chat selected
  if (!currentTextChat && !currentVoiceChat) {
    return (
      <div className="center-container h-full bg-friends">
        <p className="px-4 py-2 bg-channels rounded-full shadow-sm whitespace-nowrap">
          Select chat to start messaging!
        </p>
      </div>
    );
  }

  // text chat section
  if (currentTextChat) {
    return (
      <main className="chat-container bg-friends">
        <Messages messages={currentTextChat.messages} />
        <ChatInput
          currentChatId={currentTextChat._id}
          saveMessageFun={async (user, message, type) => {
            if (currentChannel) {
              await dispatch(
                addMessageToCurrentChat({
                  channelId: currentChannel._id,
                  chatId: currentTextChat._id,
                  sender: user.id,
                  content: message,
                  type: type,
                })
              );
            }
          }}
        />
      </main>
    );
  }

  // voice chat section
  return currentChannel?.categories.find((c) =>
    c.voiceChats.find((vc) => vc._id === currentVoiceChat?._id)
  ) ? (
    <main className="full-center-container bg-friends overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 w-full h-full overflow-y-auto scrollbar-small place-items-center">
        {currentVoiceChat?.connectedUsers.map((user) => {
          return (
            <div
              key={user._id}
              className="w-full h-60 bg-black rounded-xl"
            ></div>
          );
        })}
        <BottomPanel />
      </div>
    </main>
  ) : (
    <div className="center-container h-full bg-friends">
      <p className="px-4 py-2 bg-channels rounded-full shadow-sm whitespace-nowrap">
        Select chat to start messaging!
      </p>
    </div>
  );
}
