import ChannelsIcon from "./sections/section.channels/channel";
import Home from "./sections/section.channels/homeChannel";
import AddChannel from "./sections/section.channels/addChannel";
import { useAppSelector, useAppDispatch } from "@/_hooks/hooks";
import { useNavigate } from "react-router-dom";
import { ChannelType } from "@/types/types";
import {
  setActiveChannelIndex,
  setCurrentChannel,
} from "@/_store/channel/channelSlice";

export default function Channels() {
  const navigate = useNavigate();
  const channels = useAppSelector((state) => state.channel.channels);
  const activeIndex = useAppSelector(
    (state) => state.channel.activeChannelIndex
  );
  const dispatch = useAppDispatch();

  const handleOpenChannel = async (channel: ChannelType, index: number) => {
    await dispatch(setActiveChannelIndex(index));
    await dispatch(setCurrentChannel(channel._id));
    await navigate(`/channels/${channel._id}`, { replace: true });
  };

  const handleHome = async () => {
    await dispatch(setActiveChannelIndex(-1));
    await navigate(`/channels/me`, { replace: true });
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
      </div>
    </div>
  );
}
