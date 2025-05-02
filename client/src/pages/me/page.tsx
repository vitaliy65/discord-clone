import Channels from "@/components/userMainPage/channels";
import Friends from "@/components/userMainPage/friends";
import Chat from "@/components/userMainPage/chat";

import "@/styles/pages/me/userMainPage.css";

export default function Me() {
  return (
    <div className="user-main-page-container">
      <Channels />
      <Friends />
      <Chat />
    </div>
  );
}
