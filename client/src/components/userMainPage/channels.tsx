import { useState } from "react";
import ChannelsIcon from "./sections/section.channels/channel";
import Home from "./sections/section.channels/homeChannel";
import AddChannel from "./sections/section.channels/addChannel";
import { useAppSelector } from "@/_hooks/hooks";

import "@/styles/pages/me/sections/channels.css";
export default function Channels() {
  const [activeIndex, setActiveIndex] = useState<number | null>(-1);
  const Channels = useAppSelector((state) => state.channel.channels);

  return (
    <div className="channel-section-container bg-channels">
      <Home isActive={activeIndex === -1} onClick={() => setActiveIndex(-1)} />
      {Channels.map((channel, index) => (
        <ChannelsIcon
          key={channel._id}
          isActive={activeIndex === index}
          onClick={() => setActiveIndex(index)}
          channel={channel}
        />
      ))}
      <AddChannel
        isActive={activeIndex === -2}
        onClick={() => setActiveIndex(-2)}
      />
    </div>
  );
}
