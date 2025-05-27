import { io } from "socket.io-client";
import { SERVER_URL } from "./constants";
import {
  fetchChats,
  reciveMessage,
  setCurrentChat,
} from "@/_store/chat/chatSlice";
import { store as StoreType } from "@/_store/store";
import { fetchFriendRequestList } from "@/_store/friendRequest/friendRequestSlice";
import {
  fetchFriends,
  changeFriendOnlineStatus,
} from "@/_store/friend/friendSlice";
import {
  receiveChannelMessage,
  addChannelMember,
  userJoinedVoiceChat,
  setOnlineStatusOnServer,
  userLeftVoiceChat,
} from "@/_store/channel/channelSlice";
import { Navigate } from "react-router-dom";

export const socket = io(SERVER_URL, {
  withCredentials: true,
});

let isInitialized = false;

export const initializeSocketEvents = (store: typeof StoreType) => {
  if (isInitialized) return;

  socket.on("receive_message", (data) => {
    const { chatId, message } = data;
    store.dispatch(reciveMessage({ chatId, message }));
  });

  socket.on("friend_request_received", () => {
    store.dispatch(fetchFriendRequestList());
  });

  socket.on("friend_request_accepted", async () => {
    await Promise.all([
      store.dispatch(fetchFriends()),
      store.dispatch(fetchChats()),
    ]);
  });

  socket.on("friend_deleted", async () => {
    await Promise.all([
      store.dispatch(fetchFriends()),
      store.dispatch(fetchChats()),
      store.dispatch(setCurrentChat(null)),
    ]);
    await Navigate({ to: "/channels/me", replace: true });
  });

  socket.on(
    "update_friend_online_status",
    async ({ friendId, status }: { friendId: string; status: boolean }) => {
      store.dispatch(changeFriendOnlineStatus({ friendId, status }));
    }
  );

  socket.on("channel_chat_message_receive", (data) => {
    store.dispatch(receiveChannelMessage(data));
  });

  socket.on("channel_member_joined", (data) => {
    const {
      channelId,
      newMember,
    }: {
      channelId: string;
      newMember: {
        _id: string;
        username: string;
        user_unique_id: string;
        avatar: string;
        onlineStatus: boolean;
        userServerRole: "member";
      };
    } = data;

    Promise.all([
      store.dispatch(
        addChannelMember({
          channelId,
          newMember: {
            user: newMember,
            userServerRole: newMember.userServerRole,
          },
        })
      ),
    ]);
  });

  socket.on("server_member_change_online", (data) => {
    const {
      channelId,
      memberId,
      status,
    }: {
      channelId: string;
      memberId: string;
      status: boolean;
    } = data;

    store.dispatch(setOnlineStatusOnServer({ channelId, memberId, status }));
  });

  socket.on("user_joined_voice_chat", (data) => {
    store.dispatch(userJoinedVoiceChat(data));
  });

  socket.on("user_left_voice_chat", (data) => {
    store.dispatch(userLeftVoiceChat(data));
  });

  isInitialized = true;
};
