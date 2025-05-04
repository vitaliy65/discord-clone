import { useAppSelector } from "@/_hooks/hooks";
import { FriendType } from "@/_store/friend/friendSlice";

export default function ChatHeader() {
  const selectedFriend = useAppSelector(
    (state) => state.friend.selectedFriend
  ) as FriendType;

  return (
    <div className="chat-header-container bg-friends border-b-channels">
      {selectedFriend != null ? (
        <>
          <div className="friend-image-container">
            <img
              className="friend-img"
              src={
                selectedFriend.avatar
                  ? selectedFriend.avatar
                  : "/friend/user.png"
              }
              alt=""
              width={128}
              height={128}
            />
            <img
              className="friend-online-status"
              src={
                selectedFriend.onlineStatus
                  ? "/user/active user.png"
                  : "/user/not active user.png"
              }
              alt=""
              width={128}
              height={128}
            />
          </div>
          <p>{selectedFriend.username}</p>
        </>
      ) : null}
    </div>
  );
}
