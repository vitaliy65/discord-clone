import User from "../models/User.js";

export async function handleNewFriendRequest({ username, socket, io }) {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return;
    }

    // Emit friend request to the recipient
    io.to(user._id.toString()).emit("friend_request_received");
  } catch (error) {
    console.error("Message error:", error);
    socket.emit("friend_request_error", error.message);
  }
}

export async function handleAcceptFriendRequest({
  senderId,
  receiverId,
  socket,
  io,
}) {
  try {
    // Emit friend request to the recipient
    io.to(senderId).emit("friend_request_accepted");
    io.to(receiverId).emit("friend_request_accepted");
  } catch (error) {
    console.error("Message error:", error);
    socket.emit("friend_request_error", error.message);
  }
}
