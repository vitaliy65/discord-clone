import { motion } from "motion/react";

interface ChannelsIconProps {
  isActive: boolean;
  onClick: () => void;
}

export default function AddChannel({ isActive, onClick }: ChannelsIconProps) {
  return (
    <>
      <hr className="me-channel-underline text-friends" />
      <motion.button
        initial={{ borderRadius: "32px" }}
        animate={{ borderRadius: isActive ? "12px" : "32px" }}
        whileHover={{ borderRadius: "12px" }}
        transition={{ duration: 0.3 }}
        className="channel-button-img bg-friends"
        onClick={onClick}
      >
        <img
          className="h-8 w-8"
          src="/channels/add.png"
          alt="channelsIcon"
          width={128}
          height={128}
        />
      </motion.button>
    </>
  );
}
