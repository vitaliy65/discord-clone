import mongoose from "mongoose";
import { type } from "os";

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
  categories: [
    {
      name: {
        type: String,
        required: true,
      },
      position: {
        type: Number,
        required: true,
      },
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
            default: 64000,
          },
          permissions: {
            speakingAllowed: { type: Boolean, default: true },
            videoAllowed: { type: Boolean, default: true },
            screenShareAllowed: { type: Boolean, default: true },
          },
        },
      ],
    },
  ],
});

// Middleware для створення стандартних категорій при створенні нового каналу
channelSchema.pre("save", function (next) {
  if (this.isNew) {
    this.categories = [
      {
        name: "Text Channels",
        position: 0,
        textChats: [
          {
            name: "General",
            _id: new mongoose.Types.ObjectId(),
            type: "text",
            messages: [],
          },
        ],
        voiceChats: [],
      },
      {
        name: "Voice Channels",
        position: 1,
        textChats: [],
        voiceChats: [{ name: "Games", _id: new mongoose.Types.ObjectId() }],
      },
    ];
  }
  next();
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
