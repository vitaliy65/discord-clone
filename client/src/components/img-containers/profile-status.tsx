export default function ProfileWithStatus({
  user,
}: {
  user: { avatar: string; onlineStatus: boolean };
}) {
  return (
    <div className="friend-image-container">
      <img
        className="friend-img"
        src={user.avatar ? user.avatar : "/friend/user.png"}
        alt=""
        width={128}
        height={128}
      />
      <img
        className="friend-online-status"
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
