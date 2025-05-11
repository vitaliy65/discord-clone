import { useAppSelector } from "@/_hooks/hooks";
import { useEffect, useState } from "react";

export default function ProfilePicture({ userId }: { userId: string }) {
  const [avatar, setAvatar] = useState<string>("/friend/user.png");
  const user = useAppSelector((s) => s.user.info);
  const friends = useAppSelector((s) => s.friend.friends);

  useEffect(() => {
    if (user.id === userId) {
      setAvatar(user.avatar || "/friend/user.png");
      return;
    }

    const selectedFriend = friends.find((f) => f._id === userId);
    if (selectedFriend) {
      setAvatar(selectedFriend.avatar || "/friend/user.png");
    }
  }, [userId, user, friends]);

  return (
    <div className="friend-image-container">
      <img
        className="friend-img"
        src={avatar}
        alt="Profile picture"
        width={128}
        height={128}
      />
    </div>
  );
}
