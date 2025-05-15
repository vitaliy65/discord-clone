import { Router } from "express";
import passport from "passport";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejestFriendRequest,
  getListFriendRequest,
} from "../../controllers/friendRequestController.js";

const router = Router();

// @route   POST api/friendRequest/send
// @desc    Send friend request
// @access  Private
router.post(
  "/send",
  passport.authenticate("jwt", { session: false }),
  sendFriendRequest
);

// @route   POST api/friendRequest/accept/:id
// @desc    Accept friend request by id
// @access  Private
router.post(
  "/accept",
  passport.authenticate("jwt", { session: false }),
  acceptFriendRequest
);

// @route   POST api/friendRequest/reject/:id
// @desc    Reject friend request
// @access  Private
router.post(
  "/reject",
  passport.authenticate("jwt", { session: false }),
  rejestFriendRequest
);

// @route   GET api/friendRequest/list
// @desc    List friend requests
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  getListFriendRequest
);

const friendRequestRoutes = router;
export default friendRequestRoutes;
