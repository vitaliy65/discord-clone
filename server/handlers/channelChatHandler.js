import Channel from "../models/Channel.js";

export default async function handleChannelChat({
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
