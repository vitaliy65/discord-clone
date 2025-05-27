import { ReactElement } from "react";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { initializeSocketEvents } from "@/utils/socket";
import { store } from "@/_store/store";

import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { setOnlineStatus } from "@/_store/user/userSlice";

export default function StatusLoader({ children }: { children: ReactElement }) {
  const user = useAppSelector((s) => s.user.info);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Connect to socket server
    socket.connect();
    socket.emit("register_user", user.id);

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

  return children;
}
