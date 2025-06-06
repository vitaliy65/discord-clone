import { useAppSelector } from "@/_hooks/hooks";
import ProfileWithStatus from "../img-containers/profile-status";
import { useState } from "react";

export default function ChannelMembers() {
  const channelMembers = useAppSelector(
    (s) => s.channel.currentChannel?.members || []
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

  const filteredMembers = channelMembers.filter((member) =>
    member.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineMembers = filteredMembers.filter(
    (member) => member.user.onlineStatus
  );
  const offlineMembers = filteredMembers.filter(
    (member) => !member.user.onlineStatus
  );

  return (
    <div className="relative flex flex-col w-full h-screen">
      <div className="channel-upper-section shadow-md border-channels bg-friends scale-z-50">
        <input
          type="text"
          placeholder="Search for a user"
          className="search-friend-input bg-channels"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="channel-members-container scrollbar-small overflow-y-auto overflow-x-hidden">
        {onlineMembers.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-green-400 whitespace-nowrap mb-1 mt-2">
              В мережі
            </p>
            {onlineMembers.map((member) => (
              <div key={member.user._id} className="channel-member">
                <ProfileWithStatus user={member.user} />
                <p className="ml-2">{member.user.username}</p>
              </div>
            ))}
          </div>
        )}
        {offlineMembers.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400 whitespace-nowrap mb-1 mt-4">
              Не в мережі
            </p>
            {offlineMembers.map((member) => (
              <div key={member.user._id} className="channel-member-offline">
                <ProfileWithStatus user={member.user} />
                <p className="ml-2">{member.user.username}</p>
              </div>
            ))}
          </div>
        )}
        {filteredMembers.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 whitespace-nowrap">
              Користувачів не знайдено
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
