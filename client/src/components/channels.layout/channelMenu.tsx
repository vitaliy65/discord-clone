import { useAppSelector } from "@/_hooks/hooks";
import Hashtag from "@/assets/icons/hashtag";
import Voice from "@/assets/icons/voice";

export default function ChannelMenu() {
  const currentChat = useAppSelector((s) => s.channel.currentChat);

  return (
    <div className="channel-upper-section shadow-md border-channels bg-friends z-10">
      {currentChat && (
        <>
          {"messages" in currentChat ? <Hashtag /> : <Voice />}
          <p className="pl-2">{currentChat.name}</p>
        </>
      )}
    </div>
  );
}
