import { useState } from "react";
import AddChannelModal from "./channel-modal-add";
import ChannelButton from "./channel-button";
import Plus from "@/assets/icons/plus";

interface ChannelsIconProps {
  isActive: boolean;
  onClick: () => void;
}

export default function AddChannel({ isActive, onClick }: ChannelsIconProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    onClick();
    setIsModalOpen(true);
  };

  return (
    <>
      <hr className="me-channel-underline text-friends" />
      <ChannelButton
        isActive={isActive}
        onClick={handleClick}
        src="/channels/add.png"
        alt="channelsIcon"
      >
        <Plus />
      </ChannelButton>

      <AddChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
