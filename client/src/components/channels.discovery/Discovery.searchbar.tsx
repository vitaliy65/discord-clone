import Search from "@/assets/icons/search";
import { ServerInfo } from "@/types/types";
import { SERVER_API_URL } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";

export default function DiscoverySearchbar({
  findServer,
}: {
  findServer: (server: ServerInfo | null) => void;
}) {
  const [channelName, setChannelName] = useState("");

  const searchChannels = async () => {
    if (!channelName.trim()) return findServer(null);
    try {
      // Замість '' вкажіть ваш реальний endpoint
      const response = await axios.get(`${SERVER_API_URL}/channel/search`, {
        headers: { Authorization: localStorage.getItem("token") },
        params: { name: channelName },
      });

      findServer(response.data);
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
