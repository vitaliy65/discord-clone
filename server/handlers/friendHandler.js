import User from "../models/User.js";

export const friendStatusHandler = async ({ userId, status, socket, io }) => {
  try {
    // Update user status in DB
    //console.log(status);
    const user = await User.findById(userId);

    if (user) {
      user.onlineStatus = status;
      await user.save();

      // Send status update to all friends
      user.friends.forEach((friendId) => {
        io.to(friendId.toString()).emit("update_friend_online_status", {
          friendId: userId,
          status: status,
        });
      });
    }
  } catch (err) {
    console.error("Status change error:", err);
  }
};
