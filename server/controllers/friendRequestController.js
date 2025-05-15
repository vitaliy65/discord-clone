import { config } from "dotenv";
import User from "../models/User.js"; // Використовується нижній регістр для відповідності назві файлу
import Chat from "../models/Chat.js";
import FriendRequest from "../models/FriendRequest.js";

// Load input validation

config();

// Get current user
export const sendFriendRequest = async (req, res) => {
  const { username } = req.body;

  try {
    // check if user send request to himself
    if (req.user.username === username) {
      return res
        .status(400)
        .json({ error: "You cannot send a friend request to yourself" });
    }

    // Find friend
    const friend = await User.findOne({ username: username });
    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already friends
    if (req.user.friends.includes(friend._id)) {
      return res.status(400).json({ error: "Already friends" });
    }

    // Check existing request
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: req.user._id, recipient: friend._id },
        { sender: friend._id, recipient: req.user._id },
      ],
    });

    if (existingRequest != null && existingRequest.status === "pending") {
      return res.status(400).json({ error: "Friend request already exists" });
    }

    // Create new request
    const newFriendRequest = await FriendRequest.create({
      sender: req.user._id,
      recipient: friend._id,
      status: "pending",
    });

    // Add to friend requests
    friend.friendRequests.push({
      senderId: req.user._id,
      requestId: newFriendRequest._id,
    });
    await friend.save();

    return res.json({ success: true, message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get current user
export const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  try {
    // Find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // Check if the user is the recipient of the request
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Check if the request is already accepted
    if (friendRequest.status === "accepted") {
      return res.status(400).json({ error: "Friend request already accepted" });
    }

    // Update the status of the friend request
    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each other to friends list
    req.user.friends.push(friendRequest.sender);
    await req.user.save();

    const sender = await User.findById(friendRequest.sender);
    sender.friends.push(req.user._id);
    await sender.save();

    // Перед созданием нового чата добавляем проверку
    const existingChat = await Chat.findOne({
      participants: {
        $all: [req.user._id, friendRequest.sender],
        $size: 2,
      },
    });

    if (existingChat) {
      // Проверяем есть ли чат у пользователей в списке
      if (!req.user.chats.includes(existingChat._id)) {
        req.user.chats.push(existingChat._id);
        await req.user.save();
      }
      if (!sender.chats.includes(existingChat._id)) {
        sender.chats.push(existingChat._id);
        await sender.save();
      }
    } else {
      // Создаем новый чат если его нет
      const chat = await Chat.create({
        participants: [req.user._id, friendRequest.sender],
        messages: [],
      });
      req.user.chats.push(chat._id);
      await req.user.save();
      sender.chats.push(chat._id);
      await sender.save();
    }

    // Remove from my friend requests
    req.user.friendRequests.map((request) => {
      if (request.requestId.toString() === requestId) {
        req.user.friendRequests.pull(request);
      }
    });

    await req.user.save();

    return res.json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get current user
export const rejestFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    // Find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    // Check if the user is the recipient of the request
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Remove from my friend requests
    req.user.friendRequests.map((request) => {
      if (request.requestId.toString() === requestId) {
        req.user.friendRequests.pull(request);
      }
    });

    await req.user.save();

    // Delete the friend request
    await FriendRequest.deleteOne({ _id: requestId });

    return res.json({ success: true, message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get current user
export const getListFriendRequest = async (req, res) => {
  try {
    // Get the user's friend requests
    const senders = await User.find({
      _id: {
        $in: req.user.friendRequests.map((request) => request.senderId),
      },
    });

    const SendersInfo = senders.map((sender) => ({
      sender: {
        _id: sender._id,
        username: sender.username,
        user_unique_id: sender.user_unique_id,
        email: sender.email,
        avatar: sender.avatar,
      },
      requestId: req.user.friendRequests.find(
        (request) => request.senderId.toString() === sender._id.toString()
      ).requestId,
    }));

    res.json(SendersInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
