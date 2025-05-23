import Channels from "@/components/userMainPage/channels";
import Friends from "@/components/userMainPage/friends";
import UserProfile from "@/components/userMainPage/sections/section.profile/userProfile";
import { Outlet } from "react-router-dom";
import Menu from "@/components/userMainPage/menu";

export default function Me() {
  return (
    <div className="main-page-container">
      <section className="main-left-section-container">
        <Channels />
        <Friends />
        <UserProfile />
      </section>
      <section className="chat-container">
        <Menu />
        <Outlet />
      </section>
    </div>
  );
}
