import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  user_unique_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  onlineStatus: {
    type: Boolean,
    default: false,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequests: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FriendRequest",
      },
    },
  ],
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
