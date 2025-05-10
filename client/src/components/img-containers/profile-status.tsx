export default function ProfileWithStatus({
  user,
  isProfile,
}: {
  user: {
    avatar: string;
    onlineStatus: boolean;
  };
  isProfile?: boolean;
}) {
  return (
    <div
      className={
        isProfile ? `profile-image-container` : `friend-image-container`
      }
    >
      <img
        className="friend-img"
        src={user.avatar ? user.avatar : "/friend/user.png"}
        alt=""
        width={128}
        height={128}
      />
      <img
        className={isProfile ? `profile-online-status` : `friend-online-status`}
        src={
          user.onlineStatus
            ? "/user/active user.png"
            : "/user/not active user.png"
        }
        alt=""
        width={128}
        height={128}
      />
    </div>
  );
}
