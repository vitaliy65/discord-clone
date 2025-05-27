import User from "../models/User.js";
import Channel from "../models/Channel.js";

export const friendStatusHandler = async ({ userId, status, socket, io }) => {
  try {
    // Отримуємо користувача та його канали паралельно
    const [user, channels] = await Promise.all([
      User.findById(userId),
      Channel.find({ members: { $elemMatch: { user: userId } } }),
    ]);

    // Оновлюємо статус користувача
    user.onlineStatus = status;

    await user.save();

    // Підготовлюємо дані для відправки
    const statusUpdate = {
      friendId: userId,
      status: status,
    };

    // Відправляємо оновлення статусу всім друзям
    const friendUpdates = user.friends.map((friendId) =>
      io
        .to(friendId.toString())
        .emit("update_friend_online_status", statusUpdate)
    );

    // Відправляємо оновлення статусу всім учасникам каналів
    const channelUpdates = channels.map((channel) => {
      const update = {
        channelId: channel._id.toString(),
        memberId: userId,
        status: status,
      };

      // Відправляємо всім підключеним сокетам
      io.to(channel._id.toString()).emit("server_member_change_online", update);
    });

    // Виконуємо всі відправки паралельно
    await Promise.all([...friendUpdates, ...channelUpdates]);
  } catch (err) {
    console.error("Status change error:", err);
  }
};
