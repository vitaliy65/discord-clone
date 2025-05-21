import { ChannelType } from "@/types/types";
import ChannelButton from "./channel-button";

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
    <ChannelButton
      isActive={isActive}
      onClick={onClick}
      src={channel.avatar}
      alt={channel.name}
    />
  );
}
