import { useAppSelector } from "@/_hooks/hooks";
import Voice from "@/assets/icons/voice";
import Hashtag from "@/assets/icons/hashtag";

export default function ChannelChats() {
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);

  return (
    <div className="channel-chats-container bg-channels border-section">
      <div className="channel-name border-section">{currentChannel?.name}</div>
      <div className="friend-section-container scrollbar-small">
        {currentChannel && currentChannel?.textChats.length > 0 && (
          <div className="chats-section">
            <div className="chat-category">Text Channels</div>
            {currentChannel?.textChats.map((textChat) => (
              <div key={textChat._id} className="chat-item">
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
              <div key={voiceChat._id} className="chat-item">
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
