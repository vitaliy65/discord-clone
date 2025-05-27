import Channel from "../models/Channel.js";

export async function handleChannelChat({
  channelId,
  categoryId,
  chatId,
  content,
  type,
  senderId,
  socket,
  io,
}) {
  try {
    const newMessage = {
      sender: senderId,
      content,
      type,
      timestamp: new Date(),
    };

    // Використовуємо findOneAndUpdate з атомарним оператором $push
    const updatedChannel = await Channel.findOneAndUpdate(
      {
        _id: channelId,
        "categories._id": categoryId,
        "categories.textChats._id": chatId,
      },
      {
        $push: {
          "categories.$[category].textChats.$[chat].messages": newMessage,
        },
      },
      {
        arrayFilters: [{ "category._id": categoryId }, { "chat._id": chatId }],
        new: true, // Повертає оновлений документ
      }
    );

    if (!updatedChannel) {
      throw new Error("Failed to update channel");
    }

    // Emit to all channel members
    updatedChannel.members.forEach((member) => {
      io.to(member.user.toString()).emit("channel_chat_message_receive", {
        channelId,
        categoryId,
        chatId,
        message: newMessage,
      });
    });
  } catch (error) {
    console.error("Channel message error:", error);
    socket.emit("channel_message_error", error.message);
  }
}

export async function handleJoinVoiceChat({
  channelId,
  categoryId,
  chatId,
  userId,
  socket,
  io,
}) {
  try {
    const channel = await Channel.findOne({
      _id: channelId,
      "categories._id": categoryId,
      "categories.voiceChats._id": chatId,
    });

    const category = channel.categories.find(
      (cat) => cat._id.toString() === categoryId.toString()
    );

    const voiceChat = category.voiceChats.find(
      (chat) => chat._id.toString() === chatId.toString()
    );

    const existingUser = voiceChat.connectedUsers.find(
      (user) => user._id.toString() === userId.toString()
    );

    if (existingUser) {
      return;
    }

    voiceChat.connectedUsers.push(userId);
    await channel.save();

    // Notify other users in the voice chat\
    io.to(channel._id.toString()).emit("user_joined_voice_chat", {
      channelId,
      categoryId,
      chatId,
      userId,
    });
  } catch (error) {
    console.error("Join voice chat error:", error);
    socket.emit("voice_chat_error", error.message);
  }
}

export async function handleLeftVoiceChat({
  channelId,
  categoryId,
  chatId,
  userId,
  socket,
  io,
}) {
  try {
    const channel = await Channel.findOne({
      _id: channelId,
      "categories._id": categoryId,
      "categories.voiceChats._id": chatId,
    });

    const category = channel.categories.find(
      (cat) => cat._id.toString() === categoryId.toString()
    );

    const voiceChat = category.voiceChats.find(
      (chat) => chat._id.toString() === chatId.toString()
    );

    voiceChat.connectedUsers.pull(userId);
    await channel.save();

    // Notify other users in the voice chat
    io.to(channel._id.toString()).emit("user_left_voice_chat", {
      channelId,
      categoryId,
      chatId,
      userId,
    });
  } catch (error) {
    console.error("Left voice chat error:", error);
    socket.emit("voice_chat_error", error.message);
  }
}
