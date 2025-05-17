import Channels from "@/components/userMainPage/channels";
import Friends from "@/components/userMainPage/friends";
import UserProfile from "@/components/userMainPage/sections/section.profile/userProfile";
import { Outlet } from "react-router-dom";
import Menu from "@/components/userMainPage/menu";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { initializeSocketEvents } from "@/utils/socket";
import { store } from "@/_store/store";

import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { setOnlineStatus } from "@/_store/user/userSlice";

export default function Me() {
  const user = useAppSelector((s) => s.user.info);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Connect to socket server
    socket.connect();
    dispatch(setOnlineStatus(true));
    socket.emit("user_status_change", { userId: user.id, status: true });

    // Add window unload handler
    const handleUnload = () => {
      dispatch(setOnlineStatus(false));
      socket.emit("user_status_change", { userId: user.id, status: false });
    };
    window.addEventListener("beforeunload", handleUnload);
    initializeSocketEvents(store);

    // Clean up on component unmount
    return () => {
      socket.emit("user_status_change", { userId: user.id, status: false });
      socket.disconnect();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

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
