import User from "../../models/User"; // Використовується нижній регістр для відповідності назві файлу
import bcrypt from "bcryptjs";
import { Router } from "express";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import passport from "passport";

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const router = Router();
const secretOrKey = process.env.secretOrKey;

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const newUser = new User({
        username: req.body.username,
        user_unique_id: req.body.user_unique_id,
        email: req.body.email,
        password: req.body.password,
        avatar,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        };

        // Sign token
        jwt.sign(
          payload,
          secretOrKey,
          { expiresIn: 31556926 }, // 1 year in seconds
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar,
    });
  }
);

// @route   GET api/users/all
// @desc    Get all users
// @access  Public
router.get("/all", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(404).json({ noUsersFound: "No users found" });
    });
});

// @route   GET api/users/:id
// @desc    Get user by id
// @access  Public
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Public
router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
});

// @route   PUT api/users/:id
// @desc    Update user
// @access  Public
router.put("/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
});

export default router;
