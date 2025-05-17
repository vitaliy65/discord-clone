import { motion } from "motion/react";
import { useState } from "react";
import AddChannelModal from "./addChannelModal";

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
      <motion.button
        initial={{ borderRadius: "32px" }}
        animate={{ borderRadius: isActive ? "12px" : "32px" }}
        whileHover={{ borderRadius: "12px" }}
        transition={{ duration: 0.3 }}
        className="channel-button-img bg-friends"
        onClick={handleClick}
      >
        <img
          className="h-8 w-8"
          src="/channels/add.png"
          alt="channelsIcon"
          width={128}
          height={128}
        />
      </motion.button>

      <AddChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
