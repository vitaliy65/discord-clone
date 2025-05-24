import Channels from "@/components/userMainPage/channels";
import UserProfile from "@/components/userMainPage/sections/section.profile/userProfile";
import { Outlet } from "react-router-dom";
import ChannelMembers from "@/components/channels.layout/channel.Members";
import ChannelChats from "@/components/channels.layout/channel.Chats";
import ChannelMenu from "@/components/channels.layout/channel.Menu";
import { useAppSelector } from "@/_hooks/hooks";
import JoinServerBanner from "@/components/channels.layout/channel.JoinServerBanner";

export default function ChannelsLayout() {
  const isGuest = useAppSelector((state) => state.channel.isGuest);

  return (
    <div className="flex flex-col h-screen">
      {isGuest && (
        <section className="center-container w-full h-12 bg-blue-600">
          <JoinServerBanner />
        </section>
      )}
      <div className="main-page-container">
        <section className="main-left-section-container">
          <Channels />
          <ChannelChats />
          <UserProfile />
        </section>
        <section className="chat-container">
          <ChannelMenu />
          <Outlet />
        </section>
        <section className="chat-members-container">
          <ChannelMembers />
        </section>
      </div>
    </div>
  );
}
