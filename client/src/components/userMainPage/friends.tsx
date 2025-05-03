import SearchFriend from "./sections/section.friends/searchFriend";
import Friend from "./sections/section.friends/friend";
import FriendsHome from "./sections/section.friends/home_friends";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { useEffect } from "react";
import { fetchFriends } from "@/_store/friend/friendSlice";

import "@/styles/pages/me/sections/friends.css";

export default function Friends() {
  const friends = useAppSelector((state) => state.friend.friends);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchFriends()).unwrap();
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchData();
  }, [friends.length, dispatch]);

  return (
    <div className="flex flex-col min-w-2xs h-screen">
      <SearchFriend />
      <ul
        className="friend-section-container bg-friends"
        aria-label="friends"
        role="list"
      >
        <FriendsHome />
        <hr className="w-full text-friend-list-bg"></hr>
        {/* Render the list of friends */}
        {friends.map((friend) => (
          <Friend key={friend._id} friend={friend} />
        ))}
      </ul>
    </div>
  );
}
