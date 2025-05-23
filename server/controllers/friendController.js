import { config } from "dotenv";
import User from "../models/User.js"; // Використовується нижній регістр для відповідності назві файлу
import { io } from "../server.js";

// Load input validation

config();

export const getListFriends = async (req, res) => {
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
    .catch((err) => res.status(500).json({ error: "Error fetching friends" }));
};

export const getFriend = async (req, res) => {
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
};

export const deleteFriend = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    const friend = await User.findById(req.params.id);
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }

    // Удаляем друг друга из списков друзей
    req.user.friends = req.user.friends.filter(
      (friendId) => friendId.toString() !== req.params.id
    );
    friend.friends = friend.friends.filter(
      (friendId) => friendId.toString() !== req.user.id
    );

    await Promise.all([req.user.save(), friend.save()]);

    // Отправляем сокет-событие обоим пользователям
    io.to(req.user.id).emit("friend_deleted");
    io.to(friend.id).emit("friend_deleted");

    return res.status(200).json({ message: "Friend deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
