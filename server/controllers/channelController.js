import { config } from "dotenv";
import Channel from "../models/Channel.js";

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

export const createChannel = async (req, res) => {
  const { name, description, avatar } = req.body;

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
      owner: req.user._id,
      members: [{ user: req.user._id, userServerRole: "admin" }], // Add the owner as the first member
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
  const { name, type = "text" } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.textChats.push({
      name,
      type,
      messages: [],
    });

    await channel.save();
    res.status(201).json(channel.textChats[channel.textChats.length - 1]);
  } catch (err) {
    res.status(500).json({ error: "Error creating text chat" });
  }
};

// Add voice chat
export const addVoiceChat = async (req, res) => {
  const { name, maxParticipants = 99 } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    channel.voiceChats.push({
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
    res.status(201).json(channel.voiceChats[channel.voiceChats.length - 1]);
  } catch (err) {
    res.status(500).json({ error: "Error creating voice chat" });
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
