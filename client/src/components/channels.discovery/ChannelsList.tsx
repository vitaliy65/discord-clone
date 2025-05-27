import { useEffect, useState } from "react";
import DiscoverySearchbar from "./Discovery.searchbar";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { ServerInfo } from "@/types/types";
import ServerCard from "./ServerCard";
import { useNavigate } from "react-router-dom";
import { setCurrentChannel } from "@/_store/channel/channelSlice";
import { useAppDispatch } from "@/_hooks/hooks";
import { setCurrentChat } from "@/_store/chat/chatSlice";
import { setCurrentChat as setCurrentChannelChat } from "@/_store/channel/channelSlice";
import { ChannelType } from "@/types/types";

export default function ChannelsList() {
  const [servers, setServers] = useState<ServerInfo[] | null>(null);
  const [channelsCount, setChannelsCount] = useState<number>(20);
  const [loading, setLoading] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigator = useNavigate();

  const [searchedServer, setSearchedServer] = useState<ServerInfo | null>(null);

  useEffect(() => {
    const getServers = async () => {
      try {
        const res = await axios.get(`${SERVER_API_URL}/channel/all`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          params: {
            channelsCount,
          },
        });
        console.log(res.data);

        setServers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    getServers();
  }, [servers?.length, channelsCount]);

  const navigateToServer = async (id: string) => {
    setLoading(id);

    const res = await axios.get(`${SERVER_API_URL}/channel/server/${id}`, {
      headers: { Authorization: localStorage.getItem("token") },
    });

    const server = res.data as ChannelType;

    await Promise.all([
      dispatch(setCurrentChat(null)),
      dispatch(setCurrentChannelChat(null)),
      dispatch(setCurrentChannel(server)),
    ]);
    setLoading("");
    navigator(`/channels/${id}`);
  };

  return (
    <div className="full-container flex-col bg-friends overflow-hidden">
      <div
        className="relative center-container flex-col min-h-80 w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/channels/background/channel_banner.png')",
        }}
      >
        <div className="mb-10">
          <p className="text-6xl font-bold text-left">
            FIND A COMMUNITY YOU LOVE
          </p>
          <p className="text-6xl font-bold text-left">
            IN DISCORD-CLONE {"<3"}
          </p>
        </div>
        <DiscoverySearchbar
          findServer={(server: ServerInfo | null) => setSearchedServer(server)}
        />
      </div>
      <div className="overflow-y-auto p-4">
        <div className="four-cols-grid">
          {searchedServer ? (
            <ServerCard
              server={searchedServer}
              onClick={() => navigateToServer(searchedServer._id)}
              loading={loading}
            />
          ) : (
            servers?.map((server) => (
              <ServerCard
                key={server._id}
                server={server}
                onClick={() => navigateToServer(server._id)}
                loading={loading}
              />
            )) || null
          )}
        </div>
        <div className="center-container mt-4">
          <div className="bg-blue-600 rounded-lg ring-2 ring-white">
            <button
              onClick={() => {
                setChannelsCount(channelsCount + 20);
              }}
              className="rounded-lg p-2 w-full h-full cursor-pointer hover:bg-white/15 focus:bg-black/15"
            >
              Load more...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
