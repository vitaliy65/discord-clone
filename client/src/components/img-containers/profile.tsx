export default function ProfilePicture({ user }: { user: { avatar: string } }) {
  return (
    <div className="friend-image-container">
      <img
        className="friend-img"
        src={user.avatar ? user.avatar : "/friend/user.png"}
        alt=""
        width={128}
        height={128}
      />
    </div>
  );
}
