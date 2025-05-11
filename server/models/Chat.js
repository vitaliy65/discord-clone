import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to ensure exactly 2 participants
chatSchema.pre("save", function (next) {
  if (this.participants.length !== 2) {
    next(new Error("Chat must have exactly 2 participants"));
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
