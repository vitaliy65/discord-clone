import { useAppSelector } from "@/_hooks/hooks";
import ProfileWithStatus from "../img-containers/profile-status";
import { useState } from "react";

export default function ChannelMembers() {
  const channelMembers = useAppSelector(
    (s) => s.channelMembers.selectedChannel
  );
  const [searchQuery, setSearchQuery] = useState("");

  if (!channelMembers)
    return (
      <div className="flex flex-col w-xs h-screen overflow-hidden">
        <div className="channel-upper-section shadow-md border-channels bg-friends scale-z-50"></div>
        <div className="channel-members-container flex justify-center items-center scrollbar-small overflow-hidden">
          <div className="main-loading-spinner"></div>
        </div>
      </div>
    );

  const filteredMembers = channelMembers.members.filter((member) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineMembers = filteredMembers.filter((member) => member.onlineStatus);
  const offlineMembers = filteredMembers.filter(
    (member) => !member.onlineStatus
  );

  return (
    <div className="flex flex-col w-xs h-screen overflow-hidden">
      <div className="channel-upper-section shadow-md border-channels bg-friends scale-z-50">
        <input
          type="text"
          placeholder="Search for a user"
          className="search-friend-input bg-channels"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="channel-members-container scrollbar-small overflow-y-auto">
        {onlineMembers.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-green-400 mb-1 mt-2">В мережі</p>
            {onlineMembers.map((member) => (
              <div key={member._id} className="channel-member">
                <ProfileWithStatus user={member} />
                <p className="ml-2">{member.username}</p>
              </div>
            ))}
          </div>
        )}
        {offlineMembers.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-1 mt-4">Не в мережі</p>
            {offlineMembers.map((member) => (
              <div key={member._id} className="channel-member-offline">
                <ProfileWithStatus user={member} />
                <p className="ml-2">{member.username}</p>
              </div>
            ))}
          </div>
        )}
        {filteredMembers.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">Користувачів не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
