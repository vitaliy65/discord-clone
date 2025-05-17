import Channel from "../models/Channel.js";

export default async function handleChannelChat({
  channelId,
  chatId,
  content,
  type,
  senderId,
  socket,
  io,
}) {
  try {
    const channel = await Channel.findById(channelId);
    if (!channel) throw new Error("Channel not found");

    const textChat = channel.textChats.find(
      (chat) => chat._id.toString() === chatId
    );
    if (!textChat) throw new Error("Text chat not found");

    const newMessage = {
      sender: senderId,
      content,
      type,
      timestamp: new Date(),
    };

    textChat.messages.push(newMessage);
    await channel.save();

    // Emit to all channel members
    channel.members.forEach((member) => {
      io.to(member.user.toString()).emit("channel_chat_message_receive", {
        channelId,
        chatId,
        message: newMessage,
      });
    });
  } catch (error) {
    console.error("Channel message error:", error);
    socket.emit("channel_message_error", error.message);
  }
}
