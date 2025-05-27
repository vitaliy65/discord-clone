import handleChat from "../handlers/chatHandler.js";
import {
  handleNewFriendRequest,
  handleAcceptFriendRequest,
} from "../handlers/friendRequestHandler.js";
import handleChannelChat from "../handlers/channelChatHandler.js";
import { friendStatusHandler } from "../handlers/friendHandler.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    //console.log("Client connected:", socket.id);

    // Initialize chat handlers
    socket.on("send_message", ({ chatId, content, type, senderId }) =>
      handleChat({ chatId, content, type, senderId, socket, io })
    );

    socket.on("friend_request_send", ({ username }) =>
      handleNewFriendRequest({ username, socket, io })
    );

    socket.on("accept_friend_request", ({ senderId, receiverId }) =>
      handleAcceptFriendRequest({ senderId, receiverId, socket, io })
    );

    socket.on("user_status_change", async ({ userId, status }) =>
      friendStatusHandler({ userId, status, socket, io })
    );

    socket.on("disconnect", () => {
      //console.log("Client disconnected:", socket.id);
    });

    socket.on("register_user", async (userId) => {
      socket.userId = userId; // Зберігаємо userId в об'єкті сокета
      socket.join(userId);

      // Знаходимо всі канали, де користувач є учасником
      const channels = await Channel.find({
        "members.user": userId,
      });

      // Підписуємо користувача на всі його канали
      channels.forEach((channel) => {
        socket.join(channel._id.toString());
      });
    });

    socket.on(
      "channel_send_message",
      ({ channelId, categoryId, chatId, content, type, senderId }) => {
        handleChannelChat({
          channelId,
          categoryId,
          chatId,
          content,
          type,
          senderId,
          socket,
          io,
        });
      }
    );
  });
};

export default initializeSocket;
