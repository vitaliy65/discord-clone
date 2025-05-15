import { Router } from "express";
import passport from "passport";
import {
  deleteFriend,
  getFriend,
  getListFriends,
} from "../../controllers/friendController.js";

const router = Router();

// @route   GET api/friend/list
// @desc    Get friends list
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  getListFriends
);

// @route   GET api/friend/:id
// @desc    Get friend by ID
// @access  Private
router.get("/:id", passport.authenticate("jwt", { session: false }), getFriend);

// @route   DELETE api/friend/:id
// @desc    Delete friend
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteFriend
);

const friendRoutes = router;
export default friendRoutes;
