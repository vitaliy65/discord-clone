import { useState } from "react";
import ChannelsIcon from "./sections/section.channels/channelsIcon";
import Home from "./sections/section.channels/homeChannel";
import AddChannel from "./sections/section.channels/addChannel";

import "@/styles/pages/me/sections/channels.css";

export default function Channels() {
  const [activeIndex, setActiveIndex] = useState<number | null>(-1);

  return (
    <div className="channel-section-container bg-channels">
      <Home isActive={activeIndex === -1} onClick={() => setActiveIndex(-1)} />
      {[...Array(6)].map((_, index) => (
        <ChannelsIcon
          key={index}
          isActive={activeIndex === index}
          onClick={() => setActiveIndex(index)}
        />
      ))}
      <AddChannel
        isActive={activeIndex === -2}
        onClick={() => setActiveIndex(-2)}
      />
    </div>
  );
}
