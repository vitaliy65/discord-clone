import { ReactElement } from "react";
import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { initializeSocketEvents } from "@/utils/socket";
import { store } from "@/_store/store";

import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { setOnlineStatus } from "@/_store/user/userSlice";
import { leftVoiceChat } from "@/_store/channel/channelSlice";

export default function StatusLoader({ children }: { children: ReactElement }) {
  const user = useAppSelector((s) => s.user.info);
  const currentVoiceChat = useAppSelector((s) => s.channel.currentVoiceChat);
  const currentCategory = useAppSelector(
    (s) => s.channel.currentServerCategoryId
  );
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);
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
      if (currentVoiceChat && currentCategory && currentChannel)
        dispatch(
          leftVoiceChat({
            userId: user.id,
            chatId: currentVoiceChat._id,
            categoryId: currentCategory,
            channelId: currentChannel._id,
          })
        );
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
