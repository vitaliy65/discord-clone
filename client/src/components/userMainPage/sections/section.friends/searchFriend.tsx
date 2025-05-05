import { useState } from "react";

export default function SearchFriend() {
  const [searchUsername, setSearchUsername] = useState<string>("");

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Handle search logic here
      console.log("Searching for:", searchUsername);
    }
  };

  return (
    <div className="search-friend-container border-b-channels bg-friends">
      <input
        className="search-friend-input bg-channels"
        type="text"
        placeholder="Найти друга"
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
        onKeyDown={handleEnter}
        autoComplete="off"
      />
    </div>
  );
}
