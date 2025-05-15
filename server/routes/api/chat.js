import { Router } from "express";
import passport from "passport";
import { getListChat, getChatById } from "../../controllers/chatController.js";

const router = Router();

// @route   GET api/chat/list
// @desc    Get chat list for authenticated user
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  getListChat
);

// @route   GET api/chat/:id
// @desc    Get chat by ID for authenticated user
// @access  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getChatById
);

const chatRoutes = router;
export default chatRoutes;
