import Channels from "@/components/userMainPage/channels";
import Friends from "@/components/userMainPage/friends";
import { Outlet } from "react-router-dom";
import Menu from "@/components/userMainPage/menu";

import "@/styles/pages/me/userMainPage.css";

export default function Me() {
  return (
    <div className="user-main-page-container">
      <Channels />
      <Friends />
      <div className="chat-container">
        <Menu />
        <Outlet />
      </div>
    </div>
  );
}
