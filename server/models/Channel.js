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
  public: {
    type: Boolean,
    default: false,
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
  textChats: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["text", "announcement"],
        default: "text",
      },
      messages: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
          type: {
            type: String,
            enum: ["file", "text", "image", "audio", "video"],
            default: "text",
          },
        },
      ],
    },
  ],
  voiceChats: [
    {
      name: {
        type: String,
        required: true,
      },
      maxParticipants: {
        type: Number,
        default: 99,
      },
      connectedUsers: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          joinedAt: {
            type: Date,
            default: Date.now,
          },
          voiceState: {
            muted: { type: Boolean, default: false },
            deafened: { type: Boolean, default: false },
            videoEnabled: { type: Boolean, default: false },
            screenSharing: { type: Boolean, default: false },
          },
        },
      ],
      isLocked: {
        type: Boolean,
        default: false,
      },
      bitrate: {
        type: Number,
        default: 64000, // 64kbps default
      },
      permissions: {
        speakingAllowed: { type: Boolean, default: true },
        videoAllowed: { type: Boolean, default: true },
        screenShareAllowed: { type: Boolean, default: true },
      },
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
