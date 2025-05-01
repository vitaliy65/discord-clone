import { config } from "dotenv";
import User from "../../models/User.js"; // Використовується нижній регістр для відповідності назві файлу
import { Router } from "express";
import passport from "passport";
import FriendRequest from "../../models/FriendRequest.js";

// Load input validation

config();

const router = Router();

// @route   POST api/friendRequest/send
// @desc    Send friend request
// @access  Private
router.post(
  "/send",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { friendUsername } = req.body;

    try {
      // check if user send request to himself
      if (req.user.username === friendUsername) {
        return res
          .status(400)
          .json({ error: "You cannot send a friend request to yourself" });
      }

      // Find friend
      const friend = await User.findOne({ username: friendUsername });
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

      if (existingRequest) {
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
  }
);

// @route   POST api/friendRequest/accept/:id
// @desc    Accept friend request by id
// @access  Private
router.post(
  "/accept",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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

      // Update the status of the friend request
      friendRequest.status = "accepted";
      await friendRequest.save();

      // Add each other to friends list
      req.user.friends.push(friendRequest.sender);
      await req.user.save();

      const sender = await User.findById(friendRequest.sender);
      sender.friends.push(req.user._id);
      await sender.save();

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
  }
);

// @route   POST api/friendRequest/reject/:id
// @desc    Reject friend request
// @access  Private
router.post(
  "/reject",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// @route   GET api/friendRequest/list
// @desc    List friend requests
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

const friendRequestRoutes = router;
export default friendRequestRoutes;
