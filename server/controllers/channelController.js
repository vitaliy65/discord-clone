import { config } from "dotenv";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import { io } from "../server.js";

config();

export const getListChannel = (req, res) => {
  // Check if user has any channels
  if (req.user.channels.length === 0) {
    return res.status(400).json({ error: "No channels found" });
  }

  Channel.find({ _id: { $in: req.user.channels } })
    .then((channels) => {
      res.json(channels);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error fetching channels" });
    });
};

export const getAllChannel = async (req, res) => {
  try {
    const { channelsCount } = await req.query;

    let query = Channel.find({
      public: true,
    }).select("_id avatar name description members");

    if (channelsCount && Number.isInteger(channelsCount)) {
      query = query.limit(channelsCount);
    }

    const channels = await query;

    // Формуємо масив з потрібними полями, додаючи membersCount
    const result = channels.map((channel) => ({
      _id: channel._id,
      avatar: channel.avatar,
      name: channel.name,
      description: channel.description,
      membersCount: channel.members.length,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Помилка при отриманні всіх каналів" });
  }
};

export const getServer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const server = await Channel.findById(id);

    if (!server) {
      return res.status(404).json({ error: "Сервер не знайдено" });
    }

    res.json(server);
  } catch (err) {
    res.status(500).json({ error: "Помилка при отриманні сервера", err });
  }
};

export const getChannelById = (req, res) => {
  // Check if user has access to this channel
  if (!req.user.channels.includes(req.params.id)) {
    return res.status(403).json({ error: "Access denied to this channel" });
  }

  Channel.findById(req.params.id)
    .then((channel) => {
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error fetching channel" });
    });
};

export const getChannelMembers = async (req, res) => {
  // Перевірка, чи має користувач доступ до цього каналу
  //console.log("i'am getting members");

  try {
    // Знайти канал за ID
    const channel = await Channel.findById(req.params.id).populate(
      "members.user"
    );
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Отримати список користувачів з їх ролями
    const membersDetails = await Promise.all(
      channel.members.map(async (member) => {
        const user = await User.findById(
          member.user,
          "_id username user_unique_id avatar onlineStatus"
        );
        return {
          ...user.toObject(), // Перетворюємо документ на об'єкт
          userServerRole: member.userServerRole, // Додаємо роль користувача
        };
      })
    );

    res.json(membersDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching channel members details" });
  }
};

export const joinChannel = async (req, res) => {
  const { channelId } = req.body;
  const user = req.user;

  try {
    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Канал не знайдено" });
    }

    if (
      channel.members.some(
        (member) => member.user.toString() === user._id.toString()
      )
    ) {
      return res
        .status(400)
        .json({ error: "Ви вже є учасником цього сервера" });
    }

    // Додаємо користувача до списку учасників каналу
    channel.members.push({ user: user._id, userServerRole: "member" });
    await channel.save();

    // Додаємо канал до списку каналів користувача
    user.channels.push(channelId);
    await user.save();

    // Підписуємо користувача на канал через Socket.IO
    io.sockets.sockets.forEach((socket) => {
      if (socket.userId === user._id.toString()) {
        socket.join(channelId);
      }
    });

    // Відправляємо повідомлення в канал про нового учасника
    io.to(channelId).emit("channel_member_joined", {
      channelId,
      newMember: {
        _id: user._id,
        username: user.username,
        user_unique_id: user.user_unique_id,
        avatar: user.avatar,
        onlineStatus: user.onlineStatus,
        userServerRole: "member",
      },
    });

    res.status(200).json({ message: "Успішно приєднано до сервера", channel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при приєднанні до сервера" });
  }
};

export const searchChannel = async (req, res) => {
  const { name } = req.query;
  console.log(name);

  try {
    const channel = await Channel.findOne({ name });

    if (!channel) {
      return res.status(404).json({ error: "Канал не знайдено" });
    }

    if (channel.public) {
      const formattedChannel = {
        _id: channel._id,
        avatar: channel.avatar,
        name: channel.name,
        description: channel.description,
        membersCount: channel.members.length.toString(),
      };
      res.status(200).json(formattedChannel);
    } else {
      res.status(403).json({ error: "Канал приватний" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Помилка при пошуку сервера" });
  }
};

export const createChannel = async (req, res) => {
  const { name, description, avatar, public: isPublic } = req.body;

  // Validate input
  if (!name || !description || !avatar) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create a new channel
    const newChannel = new Channel({
      name,
      description,
      avatar,
      public: isPublic,
      owner: req.user._id,
      members: [{ user: req.user._id, userServerRole: "admin" }],
      categories: [
        {
          name: "Text Channels",
          position: 0,
          textChats: [
            {
              name: "general",
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
          voiceChats: [
            {
              name: "Group",
              maxParticipants: 99,
              connectedUsers: [],
              isLocked: false,
              bitrate: 64000,
              permissions: {
                speakingAllowed: true,
                videoAllowed: true,
                screenShareAllowed: true,
              },
            },
          ],
        },
      ],
    });

    await newChannel.save();

    // Add channel ID to user's channels list
    req.user.channels.push(newChannel._id);
    await req.user.save();

    res.status(201).json(newChannel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating channel" });
  }
};

export const deleteChannelById = async (req, res) => {
  try {
    // Check if user has access to this channel
    if (!req.user.channels.includes(req.params.id)) {
      return res.status(403).json({ error: "Access denied to this channel" });
    }

    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Delete the channel
    await Channel.findByIdAndDelete(req.params.id);

    // Remove channel from user's channels list
    req.user.channels = req.user.channels.filter(
      (channelId) => channelId.toString() !== req.params.id
    );
    await req.user.save();

    res.json({ success: true, message: "Channel deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting channel" });
  }
};

// Get channel text chats
export const getChannelTextChats = (req, res) => {
  // Check if user has access to this channel
  if (!req.user.channels.includes(req.params.id)) {
    return res.status(403).json({ error: "Access denied to this channel" });
  }

  Channel.findById(req.params.id)
    .select("textChats")
    .then((channel) => {
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel.textChats);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error fetching text chats" });
    });
};

// Get channel voice chats
export const getChannelVoiceChats = (req, res) => {
  if (!req.user.channels.includes(req.params.id)) {
    return res.status(403).json({ error: "Access denied to this channel" });
  }

  Channel.findById(req.params.id)
    .select("voiceChats")
    .then((channel) => {
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel.voiceChats);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error fetching voice chats" });
    });
};

// Add text chat
export const addTextChat = async (req, res) => {
  const { channelId, categoryId, name, type = "text" } = req.body;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const category = channel.categories.find(
      (cat) => cat._id.toString() === categoryId
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.textChats.push({
      name,
      type,
      messages: [],
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding text chat" });
  }
};

// Add voice chat
export const addVoiceChat = async (req, res) => {
  const { channelId, categoryId, name, maxParticipants = 99 } = req.body;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const category = channel.categories.find(
      (cat) => cat._id.toString() === categoryId
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.voiceChats.push({
      name,
      maxParticipants,
      connectedUsers: [],
      isLocked: false,
      bitrate: 64000,
      permissions: {
        speakingAllowed: true,
        videoAllowed: true,
        screenShareAllowed: true,
      },
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding voice chat" });
  }
};

// Delete text chat
export const deleteTextChat = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.textChats = channel.textChats.filter(
      (chat) => chat._id.toString() !== req.params.chatId
    );

    await channel.save();
    res.json({ success: true, message: "Text chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting text chat" });
  }
};

// Delete voice chat
export const deleteVoiceChat = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.voiceChats = channel.voiceChats.filter(
      (chat) => chat._id.toString() !== req.params.chatId
    );

    await channel.save();
    res.json({ success: true, message: "Voice chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting voice chat" });
  }
};

// Add message
export const addMessage = async (req, res) => {
  const { content, messageType = "text" } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const textChat = channel.textChats.find(
      (chat) => chat._id.toString() === req.params.chatId
    );

    if (!textChat) {
      return res.status(404).json({ error: "Text chat not found" });
    }

    textChat.messages.push({
      sender: req.user._id,
      content,
      messageType,
      timestamp: new Date(),
      edited: false,
    });

    await channel.save();
    res.status(201).json(textChat.messages[textChat.messages.length - 1]);
  } catch (err) {
    res.status(500).json({ error: "Error adding message" });
  }
};

// Edit message
export const editMessage = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const textChat = channel.textChats.find(
      (chat) => chat._id.toString() === req.params.chatId
    );

    if (!textChat) {
      return res.status(404).json({ error: "Text chat not found" });
    }

    const message = textChat.messages.find(
      (msg) => msg._id.toString() === req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this message" });
    }

    message.content = content;
    message.edited = true;

    await channel.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Error editing message" });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const textChat = channel.textChats.find(
      (chat) => chat._id.toString() === req.params.chatId
    );

    if (!textChat) {
      return res.status(404).json({ error: "Text chat not found" });
    }

    const message = textChat.messages.find(
      (msg) => msg._id.toString() === req.params.messageId
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this message" });
    }

    textChat.messages = textChat.messages.filter(
      (msg) => msg._id.toString() !== req.params.messageId
    );

    await channel.save();
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting message" });
  }
};

export const addCategory = async (req, res) => {
  const { channelId, name, position } = req.body;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.categories.push({
      name,
      position,
      textChats: [],
      voiceChats: [],
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding category" });
  }
};

export const deleteCategory = async (req, res) => {
  const { channelId, categoryId } = req.params;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Не дозволяємо видаляти стандартні категорії
    const category = channel.categories.find(
      (cat) => cat._id.toString() === categoryId
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (
      category.name === "Text Channels" ||
      category.name === "Voice Channels"
    ) {
      return res
        .status(403)
        .json({ error: "Cannot delete default categories" });
    }

    channel.categories = channel.categories.filter(
      (cat) => cat._id.toString() !== categoryId
    );

    await channel.save();
    res.status(200).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting category" });
  }
};

export const updateCategoryPosition = async (req, res) => {
  const { channelId, categoryId } = req.params;
  const { position } = req.body;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const category = channel.categories.find(
      (cat) => cat._id.toString() === categoryId
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.position = position;
    await channel.save();
    res.status(200).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating category position" });
  }
};

export const JoinServerVoiceChat = async (req, res) => {
  const { channelId, chatId, categoryId } = req.body;
  const userId = req.user._id;

  try {
    const channel = await Channel.findOne({
      _id: channelId,
      "categories._id": categoryId,
      "categories.voiceChats._id": chatId,
    });

    if (!channel) {
      return res.status(404).json({ error: "Voice chat not found" });
    }

    // Знаходимо конкретний голосовий чат
    const category = channel.categories.find(
      (cat) => cat._id.toString() === categoryId
    );
    const voiceChat = category.voiceChats.find(
      (chat) => chat._id.toString() === chatId
    );

    if (!voiceChat) {
      return res.status(404).json({ error: "Voice chat not found" });
    }

    // Перевіряємо, чи користувач вже в чаті
    if (
      voiceChat.connectedUsers.some(
        (user) => user.user.toString() === userId.toString()
      )
    ) {
      return res.status(400).json({ error: "User already in voice chat" });
    }

    // Додаємо користувача до голосового чату
    voiceChat.connectedUsers.push({
      user: userId,
      joinedAt: new Date(),
      voiceState: {
        muted: false,
        deafened: false,
        videoEnabled: false,
        screenSharing: false,
      },
    });

    // Відправляємо повідомлення всім користувачам каналу
    io.to(channelId).emit("user_joined_voice_chat", {
      userId,
      chatId,
      categoryId,
      channelId,
    });

    await channel.save();
    res.status(200).json({ message: "Joined voice chat successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error joining voice chat" });
  }
};
