import Search from "@/assets/icons/search";
import axios from "axios";
import { useState } from "react";

export default function DiscoverySearchbar() {
  const [channelName, setChannelName] = useState("");

  const searchChannels = async () => {
    if (!channelName.trim()) return;
    try {
      // Замість '' вкажіть ваш реальний endpoint
      const response = await axios.get("/api/channels/search", {
        params: { name: channelName },
      });
      // Тут можна обробити response
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await searchChannels();
    }
  };

  return (
    <div className="absolute center-container h-16 bottom-0">
      <div className="relative center-container flex-row">
        <input
          type="text"
          value={channelName}
          name="channelSearch"
          className="py-2 px-4 w-xs rounded-full shadow-md bg-channels focus:outline-3 outline-indigo-700"
          onChange={(e) => setChannelName(e.target.value)}
          onKeyDown={handleSearch}
        ></input>
        <Search
          className="absolute right-0 mr-2 cursor-pointer"
          onClick={searchChannels}
        />
      </div>
    </div>
  );
}
