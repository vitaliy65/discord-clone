import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      userServerRole: {
        type: String,
        enum: ["admin", "moderator", "member"],
        default: "member",
      },
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
