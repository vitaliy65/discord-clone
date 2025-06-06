import SearchFriend from "./sections/section.friends/searchFriend";
import Friend from "./sections/section.friends/friend";
import { useAppSelector } from "@/_hooks/hooks";

import { useEffect, useState } from "react";
import { FriendType } from "@/types/types";

interface FriendChat {
  friend: FriendType;
  chatId: string;
}

export default function Friends() {
  const friends = useAppSelector((state) => state.friend.friends);
  const chats = useAppSelector((state) => state.chat.chats);
  const filter = useAppSelector((state) => state.filter.action);
  const [_friendChats, setFriendChats] = useState<FriendChat[]>([]);

  useEffect(() => {
    const friendChats: FriendChat[] = [];

    friends.forEach((friend) => {
      const chat = chats.find((chat) => chat.participants.includes(friend._id));
      if (chat) {
        friendChats.push({ friend, chatId: chat._id });
      }
    });
    setFriendChats(friendChats);
  }, [friends, chats]);

  return (
    <div className="friends-container bg-friends border-r-channels">
      <SearchFriend />
      <ul
        className="friend-section-container scrollbar-small"
        aria-label="friends"
        role="list"
      >
        {/* Render the list of friends */}
        {_friendChats
          .filter((fc) => {
            // Apply search filter
            if (filter.searchParams) {
              return fc.friend.username
                .toLowerCase()
                .includes(filter.searchParams.toLowerCase());
            }
            // Apply online/all filter
            return filter.showOnline ? fc.friend.onlineStatus : filter.showAll;
          })
          .map((fc) => (
            <Friend key={fc.chatId} friend={fc.friend} chatId={fc.chatId} />
          ))}
      </ul>
    </div>
  );
}
