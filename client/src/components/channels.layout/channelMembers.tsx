import { useAppSelector } from "@/_hooks/hooks";
import ProfileWithStatus from "../img-containers/profile-status";

export default function ChannelMembers() {
  const channelMembers = useAppSelector(
    (s) => s.channelMembers.selectedChannel
  );

  if (!channelMembers) return null;

  return (
    <div className="flex flex-col w-xs h-screen overflow-hidden">
      <div className="channel-upper-section shadow-md border-channels bg-friends scale-z-50">
        <input
          type="text"
          placeholder="Search for a user"
          className="search-friend-input bg-channels"
        />
      </div>
      <div className="channel-members-container scrollbar-small overflow-auto">
        <>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-green-400 mb-1 mt-2">В мережі</p>
            {channelMembers.members
              .filter((member) => member.onlineStatus)
              .map((member) => (
                <div key={member._id} className="channel-member">
                  <ProfileWithStatus user={member} />
                  <p className="ml-2">{member.username}</p>
                </div>
              ))}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1 mt-4">Не в мережі</p>
            {channelMembers.members
              .filter((member) => !member.onlineStatus)
              .map((member) => (
                <div key={member._id} className="flex items-center opacity-60">
                  <ProfileWithStatus user={member} />
                  <p className="ml-2">{member.username}</p>
                </div>
              ))}
          </div>
        </>
      </div>
    </div>
  );
}
