import {
  deleteFriend,
  FriendType,
  setCurrentFriend,
} from "@/_store/friend/friendSlice";

import { useAppDispatch } from "@/_hooks/hooks";
import {
  setCurrentChat,
  setCurrentChatMessages,
} from "@/_store/chat/chatSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PopUpContainer from "@/components/animatedComponents/popUpContainer";
import ProfileWithStatus from "@/components/img-containers/profile-status";

export default function Friend({
  friend,
  chatId,
}: {
  friend: FriendType;
  chatId: string;
}) {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const [openPopUp, setOpenPopUp] = useState(false);

  const handleOpenChat = async () => {
    Promise.all([
      dispatch(setCurrentChat(chatId)),
      dispatch(setCurrentChatMessages(chatId)),
      dispatch(setCurrentFriend(friend)),
    ]);

    await navigator(`/channels/me/${chatId}`, {
      state: { chatId },
    });
  };

  const handleDeleteFriend = async () => {
    await dispatch(deleteFriend(friend._id));
  };

  return (
    <li className="w-full">
      <div
        className="friend-button hover:bg-custom-focus focus:bg-clicked"
        onClick={handleOpenChat}
      >
        <div className="flex flex-row gap-3">
          <ProfileWithStatus user={friend} />
          <p className="border-friend-list-background">{friend.username}</p>
        </div>
        <button
          className="delete-friend-button"
          onClick={() => setOpenPopUp(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <PopUpContainer
        text={"Подтвердите удаление пользователя из вашего списка друзей:"}
        buttonText={"удалить"}
        isVisible={openPopUp}
        onClickAccept={handleDeleteFriend}
        onClickCancel={() => setOpenPopUp(false)}
      />
    </li>
  );
}
