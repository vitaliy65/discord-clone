import { ChannelType } from "@/types/types";
import { motion } from "motion/react";

interface ChannelsIconProps {
  channel: ChannelType;
  isActive: boolean;
  onClick: () => void;
}

export default function ChannelsIcon({
  channel,
  isActive,
  onClick,
}: ChannelsIconProps) {
  return (
    <motion.button
      initial={{ borderRadius: "32px" }}
      animate={{ borderRadius: isActive ? "12px" : "32px" }}
      whileHover={{ borderRadius: "12px" }}
      transition={{ duration: 0.3 }}
      className="channel-button-img bg-friends"
      onClick={onClick}
    >
      <img src={channel.avatar} alt="channelsIcon" width={128} height={128} />
    </motion.button>
  );
}
