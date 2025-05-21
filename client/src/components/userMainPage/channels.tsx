import ChannelsIcon from "./sections/section.channels/channel";
import Home from "./sections/section.channels/channel-home";
import AddChannel from "./sections/section.channels/channel-add";
import { useAppSelector, useAppDispatch } from "@/_hooks/hooks";
import { useNavigate } from "react-router-dom";
import { ChannelType } from "@/types/types";
import {
  fetchChannelMembers,
  setActiveChannelIndex,
  setCurrentChannel,
  setCurrentChat,
} from "@/_store/channel/channelSlice";
import SearchChannel from "./sections/section.channels/channel-search";

export default function Channels() {
  const navigate = useNavigate();
  const channels = useAppSelector((state) => state.channel.channels);
  const activeIndex = useAppSelector(
    (state) => state.channel.activeChannelIndex
  );
  const dispatch = useAppDispatch();

  const handleOpenChannel = async (channel: ChannelType, index: number) => {
    await Promise.all([
      dispatch(setActiveChannelIndex(index)),
      dispatch(setCurrentChannel(channel._id)),
      dispatch(setCurrentChat(null)),
      dispatch(fetchChannelMembers(channel._id)),
    ]);

    navigate(`/channels/${channel._id}`);
  };

  const handleHome = async () => {
    await dispatch(setActiveChannelIndex(-1));
    navigate(`/channels/me`);
  };

  return (
    <div className="channel-container bg-channels">
      <div className="channel-section scrollbar-hide">
        <Home isActive={activeIndex === -1} onClick={() => handleHome()} />
        {channels.map((channel, index) => (
          <ChannelsIcon
            key={channel._id}
            isActive={activeIndex === index}
            onClick={() => handleOpenChannel(channel, index)}
            channel={channel}
          />
        ))}
        <AddChannel
          isActive={activeIndex === -2}
          onClick={() => dispatch(setActiveChannelIndex(-2))}
        />
        <SearchChannel />
      </div>
    </div>
  );
}
