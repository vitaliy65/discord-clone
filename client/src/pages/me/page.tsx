import Channels from "@/components/userMainPage/channels";
import Friends from "@/components/userMainPage/friends";
import { Outlet } from "react-router-dom";
import Menu from "@/components/userMainPage/menu";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { initializeSocketEvents } from "@/utils/socket";
import { store } from "@/_store/store";

import "@/styles/pages/me/userMainPage.css";
import { useAppSelector } from "@/_hooks/hooks";

export default function Me() {
  const userId = useAppSelector((s) => s.user.user.id);

  useEffect(() => {
    // Connect to socket server
    socket.connect();
    socket.emit("user_status_change", { userId, status: true });

    // Add window unload handler
    const handleUnload = () => {
      socket.emit("user_status_change", { userId, status: false });
    };
    window.addEventListener("beforeunload", handleUnload);
    initializeSocketEvents(store);

    // Clean up on component unmount
    return () => {
      socket.emit("user_status_change", { userId, status: false });
      socket.disconnect();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

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
