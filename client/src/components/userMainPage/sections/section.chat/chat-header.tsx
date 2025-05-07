import { useAppSelector } from "@/_hooks/hooks";
import { FriendType } from "@/_store/friend/friendSlice";
import ProfileWithStatus from "@/components/img-containers/profile-status";

export default function ChatHeader() {
  const selectedFriend = useAppSelector(
    (state) => state.friend.selectedFriend
  ) as FriendType;

  return (
    <div className="chat-header-container bg-friends border-b-channels">
      {selectedFriend != null ? (
        <>
          <ProfileWithStatus user={selectedFriend} />
          <p>{selectedFriend.username}</p>
        </>
      ) : null}
    </div>
  );
}
