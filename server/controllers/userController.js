import User from "../models/User.js";
import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import validateRegisterInput from "../validation/register.js";
import validateLoginInput from "../validation/login.js";

config();

const secretOrKey = process.env.secretOrKey;

export const registerUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    $or: [
      { email: req.body.email },
      { username: req.body.username },
      { user_unique_id: req.body.user_unique_id },
    ],
  }).then((user) => {
    if (user) {
      if (user.email === req.body.email)
        return res.status(400).json({ email: "Email already exists" });
      if (user.username === req.body.username)
        return res.status(400).json({ username: "Username already exists" });
      if (user.user_unique_id === req.body.user_unique_id)
        return res
          .status(400)
          .json({ user_unique_id: "This ID already exists" });
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

      const { password, ...userForReturn } = newUser.toObject();

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        if (salt == null) throw new Error("Salt generation failed");
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          if (hash == null) throw new Error("Hash generation failed");
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(userForReturn))
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

// Login user
export const loginUser = (req, res) => {
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
          email: user.email,
          user_unique_id: user.user_unique_id,
          avatar: user.avatar,
        };

        // Sign token
        const token = jwt.sign(payload, secretOrKey, { expiresIn: "3h" });
        res.json({
          token: "Bearer " + token,
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
};

// Get current user
export const getCurrentUser = (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
    user_unique_id: req.user.user_unique_id,
    avatar: req.user.avatar,
    onlineStatus: req.user.onlineStatus,
    friends: req.user.friends,
    FriendRequests: req.user.friendRequests,
    channels: req.user.Channels,
  });
};

// Delete current user
export const deleteCurrentUser = (req, res) => {
  User.findByIdAndDelete(req.user.id)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
};

// Update current user
export const updateCurrentUser = (req, res) => {
  User.findByIdAndUpdate(req.user.id, { $set: req.body }, { new: true })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
};

// ADMIN ROUTES!!!
// Get all
export const adminGetAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      const sanitizedUsers = users.map((user) => {
        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
      });
      res.json(sanitizedUsers);
    })
    .catch((err) => {
      res.status(404).json({ noUsersFound: "No users found" });
    });
};

// Get user
export const adminGetUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
};

// Delete user
export const adminDeleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
};

// Update user
export const adminUpdateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(404).json({ noUserFound: "No user found with that ID" });
    });
};
