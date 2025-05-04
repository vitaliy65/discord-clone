import { FriendType, setCurrentFriend } from "@/_store/friend/friendSlice";

import { useAppDispatch } from "@/_hooks/hooks";
import { setCurrentChat } from "@/_store/chat/chatSlice";
import { useNavigate } from "react-router-dom";

export default function Friend({
  friend,
  chatId,
}: {
  friend: FriendType;
  chatId: string;
}) {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const handleOpenChat = async () => {
    await dispatch(setCurrentChat(chatId));
    await dispatch(setCurrentFriend(friend));
    await navigator(`/channels/me/${chatId}`, {
      state: { chatId },
    });
  };

  return (
    <li className="w-full">
      <button
        className="friend-button hover:bg-custom-focus focus:bg-clicked"
        onClick={handleOpenChat}
      >
        <div className="friend-image-container">
          <img
            className="friend-img"
            src={friend.avatar ? friend.avatar : "/friend/user.png"}
            alt=""
            width={128}
            height={128}
          />
          <img
            className="friend-online-status"
            src={
              friend.onlineStatus
                ? "/user/active user.png"
                : "/user/not active user.png"
            }
            alt=""
            width={128}
            height={128}
          />
        </div>
        <p className="border-friend-list-background username">
          {friend.username}
        </p>
      </button>
    </li>
  );
}
