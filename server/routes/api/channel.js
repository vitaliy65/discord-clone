import { config } from "dotenv";
import Channel from "../../models/Channel.js";
import { Router } from "express";
import passport from "passport";

config();

const router = Router();

// @route   GET api/channel/list
// @desc    Get channels list for authenticated user
// @access  Private
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check if user has any channels
    if (req.user.Channels.length === 0) {
      return res.status(400).json({ error: "No channels found" });
    }

    Channel.find({ _id: { $in: req.user.Channels } })
      .then((channels) => {
        res.json(channels);
      })
      .catch((err) => {
        res.status(500).json({ error: "Error fetching channels" });
      });
  }
);

// @route   GET api/channel/:id
// @desc    Get channel by ID
// @access  Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Check if user has access to this channel
    if (!req.user.Channels.includes(req.params.id)) {
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
  }
);

// @route   POST api/channel/create
// @desc    Create a new channel
// @access  Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      req.user.Channels.push(newChannel._id);
      await req.user.save();

      res.status(201).json(newChannel);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error creating channel" });
    }
  }
);

// @route   DELETE api/channel/:id
// @desc    Delete channel by ID
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Check if user has access to this channel
      if (!req.user.Channels.includes(req.params.id)) {
        return res.status(403).json({ error: "Access denied to this channel" });
      }

      const channel = await Channel.findById(req.params.id);
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }

      // Delete the channel
      await Channel.findByIdAndDelete(req.params.id);

      // Remove channel from user's channels list
      req.user.Channels = req.user.Channels.filter(
        (channelId) => channelId.toString() !== req.params.id
      );
      await req.user.save();

      res.json({ success: true, message: "Channel deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting channel" });
    }
  }
);

const channelRoutes = router;
export default channelRoutes;
