import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import Voice from "@/assets/icons/voice";
import Hashtag from "@/assets/icons/hashtag";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChannelTextChatType, ChannelVoiceChatType } from "@/types/types";
import { setCurrentChat } from "@/_store/channel/channelSlice";

export default function ChannelChats() {
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleChatSelect = (
    chat: ChannelTextChatType | ChannelVoiceChatType
  ) => {
    if ("_id" in chat) {
      setSelectedChatId(chat._id);
      dispatch(setCurrentChat(chat));
      navigator(`/channels/${currentChannel?._id}/${chat._id}`, {
        replace: true,
      });
    }
  };

  return (
    <div className="channel-chats-container bg-channels border-section">
      <div className="channel-name border-section">{currentChannel?.name}</div>
      <div className="friend-section-container scrollbar-small">
        {currentChannel && currentChannel?.textChats.length > 0 && (
          <div className="chats-section">
            <div className="chat-category">Text Channels</div>
            {currentChannel?.textChats.map((textChat) => (
              <div
                key={textChat._id}
                className={`chat-item ${
                  selectedChatId === textChat._id ? "chat-item--selected" : ""
                }`}
                onClick={() => handleChatSelect(textChat)}
              >
                <div className="text-chat">
                  <Hashtag className="h-6 w-6" />
                  <p>{textChat.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentChannel && currentChannel?.voiceChats.length > 0 && (
          <div className="chats-section">
            <div className="chat-category">Voice Channels</div>
            {currentChannel?.voiceChats.map((voiceChat) => (
              <div
                key={voiceChat._id}
                className={`chat-item ${
                  selectedChatId === voiceChat._id ? "chat-item--selected" : ""
                }`}
                onClick={() => handleChatSelect(voiceChat)}
              >
                <div className="voice-chat">
                  <Voice className="h-6 w-6" />
                  <p>{voiceChat.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
