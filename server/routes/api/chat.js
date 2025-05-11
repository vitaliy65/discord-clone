import { config } from "dotenv";
import Chat from "../../models/Chat.js";
import { Router } from "express";
import passport from "passport";

config();

const router = Router();

// @route   GET api/chat/list
// @desc    Get chat list for authenticated user
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check if user has any chats
    if (req.user.chats.length === 0) {
      return res.status(400).json({ error: "No chats found" });
    }

    Chat.find({ _id: { $in: req.user.chats } })
      .then((chats) => {
        res.json(chats);
      })
      .catch((err) => {
        res.status(500).json({ error: "Error fetching chats" });
      });
  }
);

// @route   GET api/chat/:id
// @desc    Get chat by ID for authenticated user
// @access  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check if user has access to the chat
    if (!req.user.chats.includes(req.params.id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // check if user is part of the chat
    Chat.findById(req.params.id)
      .then((chat) => {
        if (!chat) {
          return res.status(404).json({ error: "Chat not found" });
        }
        if (!chat.members.includes(req.user._id)) {
          return res.status(403).json({ error: "Access denied" });
        }
        res.json(chat);
      })
      .catch((err) => {
        res.status(500).json({ error: "Error fetching chat" });
      });

    Chat.findById(req.params.id)
      .then((chat) => {
        if (!chat) {
          return res.status(404).json({ error: "Chat not found" });
        }
        res.json(chat);
      })
      .catch((err) => {
        res.status(500).json({ error: "Error fetching chat" });
      });
  }
);

const chatRoutes = router;
export default chatRoutes;
