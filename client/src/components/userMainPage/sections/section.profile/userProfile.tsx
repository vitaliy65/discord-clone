import { useAppSelector } from "@/_hooks/hooks";
import ProfileWithStatus from "@/components/img-containers/profile-status";

import "@/styles/pages/me/sections/userProfile.css";

export default function UserProfile() {
  const user = useAppSelector((s) => s.user.info);
  return (
    <div className="user-profile-container">
      <div className="user-profile-items-section bg-profile">
        <div className="items-position-center flex-row">
          <ProfileWithStatus user={user} isProfile={true} />
          <div className="flex justify-center flex-col ml-2">
            <p className="">{user.username}</p>
            <p className=" text-xs text-gray-400">@{user.user_unique_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
