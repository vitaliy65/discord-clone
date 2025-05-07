import { io } from "socket.io-client";
import { SERVER_URL } from "./constants";
import {
  fetchChats,
  reciveMessage,
  setCurrentChat,
} from "@/_store/chat/chatSlice";
import { store as StoreType } from "@/_store/store";
import { fetchFriendRequestList } from "@/_store/friendRequest/friendRequestSlice";
import { fetchFriends } from "@/_store/friend/friendSlice";
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
    console.log("Received message: ", data);
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

  isInitialized = true;
};
