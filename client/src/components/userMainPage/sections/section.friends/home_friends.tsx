import { Link } from "react-router-dom";

export default function FriendsHome() {
  return (
    <li className="w-full">
      <Link
        to={"/channels/me"}
        className="friend-button hover:bg-custom-focus focus:bg-clicked"
      >
        <img
          className="friend-image-container"
          src={"/friend/friends.png"}
          alt="friends"
          width={128}
          height={128}
        />
        <p className="friend-username">Друзья</p>
      </Link>
    </li>
  );
}
