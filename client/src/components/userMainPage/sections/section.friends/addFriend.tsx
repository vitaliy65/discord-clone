import PopUpContainer from "@/components/animatedComponents/popUpContainer";
import { setCloseAddFriendForm } from "@/_store/filter/filterFriendSlice";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendFriendRequest } from "@/_store/friendRequest/friendRequestSlice";

export default function AddFriend() {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [isVisible, setVisible] = useState(true);
  const friendRequests = useAppSelector((state) => state.friendRequest);

  const handleFriendRequest = async (username?: string) => {
    if (username) {
      const result = await dispatch(sendFriendRequest(username));

      // Check if the request was successful (no error)
      if (!result.payload || typeof result.payload === "string") {
        return; // Don't close if there's an error
      }

      // Close only on success
      dispatch(setCloseAddFriendForm());
      setVisible(false);
    }
  };

  const handleCloseMenu = () => {
    dispatch(setCloseAddFriendForm());
    setVisible(false);
  };

  return (
    <div className="items-position-center bg-channels w-full h-full">
      <PopUpContainer
        text="Введите имя пользователя:"
        buttonText="отправить"
        isVisible={isVisible}
        hasInput={true}
        inputErrorPlaceHolder={friendRequests.error || ""}
        onClickAccept={handleFriendRequest}
        onClickCancel={handleCloseMenu}
        onAnimationEnd={() => navigator("..", { replace: true })}
      />
    </div>
  );
}
