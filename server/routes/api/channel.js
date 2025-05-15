import { Router } from "express";
import passport from "passport";
import {
  getChannelById,
  getListChannel,
  createChannel,
  deleteChannelById,
  getChannelTextChats,
  getChannelVoiceChats,
  addTextChat,
  addVoiceChat,
  deleteTextChat,
  deleteVoiceChat,
  addMessage,
  editMessage,
  deleteMessage,
} from "../../controllers/channelController.js";

const router = Router();

// @route   GET api/channel/list
// @desc    Get channels list for authenticated user
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  getListChannel
);

// @route   GET api/channel/:id
// @desc    Get channel by ID
// @access  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getChannelById
);

// @route   POST api/channel/create
// @desc    Create a new channel
// @access  Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createChannel
);

// @route   DELETE api/channel/:id
// @desc    Delete channel by ID
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteChannelById
);

// New routes for text chats
router.get(
  "/:id/text-chats",
  passport.authenticate("jwt", { session: false }),
  getChannelTextChats
);
router.post(
  "/:id/text-chats",
  passport.authenticate("jwt", { session: false }),
  addTextChat
);
router.delete(
  "/:id/text-chats/:chatId",
  passport.authenticate("jwt", { session: false }),
  deleteTextChat
);

// New routes for voice chats
router.get(
  "/:id/voice-chats",
  passport.authenticate("jwt", { session: false }),
  getChannelVoiceChats
);
router.post(
  "/:id/voice-chats",
  passport.authenticate("jwt", { session: false }),
  addVoiceChat
);
router.delete(
  "/:id/voice-chats/:chatId",
  passport.authenticate("jwt", { session: false }),
  deleteVoiceChat
);

// New routes for messages
router.post(
  "/:id/text-chats/:chatId/messages",
  passport.authenticate("jwt", { session: false }),
  addMessage
);
router.put(
  "/:id/text-chats/:chatId/messages/:messageId",
  passport.authenticate("jwt", { session: false }),
  editMessage
);
router.delete(
  "/:id/text-chats/:chatId/messages/:messageId",
  passport.authenticate("jwt", { session: false }),
  deleteMessage
);

const channelRoutes = router;
export default channelRoutes;
