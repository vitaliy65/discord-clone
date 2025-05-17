import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import AcceptIcon from "/public/accept.svg";
import RejectIcon from "/public/reject.svg";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/_store/friendRequest/friendRequestSlice";
import ProfilePicture from "@/components/img-containers/profile";

export default function FriendRequets() {
  const dispatch = useAppDispatch();
  const friendRequests = useAppSelector(
    (state) => state.friendRequest.requests
  );
  const userId = useAppSelector((s) => s.user.info.id);

  const Accept = async (requestId: string, senderId: string) => {
    await dispatch(
      acceptFriendRequest({ requestId, senderId, receiverId: userId })
    );
  };

  const Reject = async (requestId: string) => {
    await dispatch(rejectFriendRequest(requestId));
  };

  if (friendRequests.length === 0) {
    return (
      <div className="items-position-center w-full h-full bg-channels">
        <p className="select-chat-container bg-friends">
          No new friend requests :&#40;
        </p>
      </div>
    );
  }

  return (
    <div className="friend-requests-container bg-channels">
      {friendRequests &&
        friendRequests.map((fr, index) => {
          return (
            <div key={index} className="friend-request-container bg-friends">
              <div className="friend-request-user-info-container">
                <ProfilePicture userId={fr.sender._id} />
                <span className="friend-requests-username">
                  {fr.sender.username}
                </span>
              </div>
              <div className="friend-request-buttons-container">
                <button
                  className="friend-requests-button-accept"
                  onClick={() => Accept(fr.requestId, fr.sender._id)}
                >
                  <img src={AcceptIcon} alt="Accept" className="h-6 w-6" />
                </button>
                <button
                  className="friend-requests-button-reject"
                  onClick={() => Reject(fr.requestId)}
                >
                  <img src={RejectIcon} alt="Accept" className="h-6 w-6" />
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
