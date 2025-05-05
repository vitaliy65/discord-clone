import { config } from "dotenv";
import User from "../../models/User.js"; // Використовується нижній регістр для відповідності назві файлу
import { Router } from "express";
import passport from "passport";

// Load input validation

config();

const router = Router();

// @route   GET api/friend/list
// @desc    Get friends list
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check if the user has friends
    if (req.user.friends.length === 0) {
      return res.status(400).json({ error: "No friends found" });
    }

    User.find({ _id: { $in: req.user.friends } })
      .then((friends) => {
        // filtered friends to exclude sensitive information
        const filteredFriends = friends.map((friend) => {
          const { password, role, __v, friendRequests, ...filteredfriend } =
            friend.toObject();
          return filteredfriend;
        });

        res.json(filteredFriends);
      })
      .catch((err) =>
        res.status(500).json({ error: "Error fetching friends" })
      );
  }
);

// @route   GET api/friend/:id
// @desc    Get friend by ID
// @access  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check if the user is trying to get themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "Cannot get yourself" });
    }

    // check if the friend exists in the user's friends list
    if (!req.user.friends.includes(req.params.id)) {
      return res.status(400).json({ error: "Friend not found in your list" });
    }

    User.findById(req.params.id)
      .then((friend) => {
        if (!friend) {
          return res.status(404).json({ error: "Friend not found" });
        }
        // filtered friend to exclude sensitive information
        const { password, role, __v, friendRequests, ...filteredfriend } =
          friend.toObject();
        res.json(filteredfriend);
      })
      .catch((err) => res.status(500).json({ error: "Error fetching friend" }));
  }
);

// @route   DELETE api/friend/:id
// @desc    Delete friend
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check if the user is trying to delete themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    // check if the friend exists in the user's friends list
    if (!req.user.friends.includes(req.params.id)) {
      return res.status(400).json({ error: "Friend not found in your list" });
    }

    // remove the friend from the user's friends list
    req.user.friends = req.user.friends.filter(
      (friendId) => friendId.toString() !== req.params.id
    );
    req.user.save();
  }
);

const friendRoutes = router;
export default friendRoutes;
