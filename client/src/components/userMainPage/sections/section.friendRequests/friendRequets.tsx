import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import AcceptIcon from "/public/accept.svg";
import RejectIcon from "/public/reject.svg";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/_store/friendRequest/friendRequestSlice";
import ProfilePicture from "@/components/img-containers/profile";

import "@/styles/pages/me/sections/friendRequests.css";

export default function FriendRequets() {
  const dispatch = useAppDispatch();
  const friendRequests = useAppSelector(
    (state) => state.friendRequest.requests
  );
  const userId = useAppSelector((s) => s.user.user.id);

  const Accept = async (requestId: string, senderId: string) => {
    await dispatch(
      acceptFriendRequest({ requestId, senderId, receiverId: userId })
    );
  };

  const Reject = async (requestId: string) => {
    await dispatch(rejectFriendRequest(requestId));
  };

  return (
    <div className="friend-requests-container bg-channels">
      {friendRequests &&
        friendRequests.map((fr, index) => {
          return (
            <div key={index} className="friend-request-container bg-friends">
              <div className="friend-request-user-info-container">
                <ProfilePicture user={fr.sender} />
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
