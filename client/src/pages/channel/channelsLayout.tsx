import Channels from "@/components/userMainPage/channels";
import UserProfile from "@/components/userMainPage/sections/section.profile/userProfile";
import { Outlet } from "react-router-dom";
import ChannelMembers from "@/components/channels.layout/channelMembers";
import ChannelChats from "@/components/channels.layout/channelChats";
import ChannelMenu from "@/components/channels.layout/channelMenu";

import "@/styles/pages/containers/containers.css";

export default function ChannelsLayout() {
  return (
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
  );
}
