import { io } from "socket.io-client";
import { SERVER_URL } from "./constants";
import { reciveMessage } from "@/_store/chat/chatSlice";
import { store as StoreType } from "@/_store/store";

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

  isInitialized = true;
};
