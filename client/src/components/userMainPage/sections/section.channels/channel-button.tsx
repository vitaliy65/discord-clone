import { motion } from "motion/react";

interface ChannelButtonProps {
  isActive: boolean;
  onClick: () => void;
  src: string;
  alt: string;
  children?: React.ReactNode;
}

export default function ChannelButton({
  isActive,
  onClick,
  src,
  alt,
  children,
}: ChannelButtonProps) {
  return (
    <motion.button
      initial={{ borderRadius: "32px" }}
      animate={{ borderRadius: isActive ? "12px" : "32px" }}
      whileHover={{ borderRadius: "12px" }}
      transition={{ duration: 0.3 }}
      className="channel-button-img bg-friends"
      onClick={onClick}
    >
      {children ? (
        children
      ) : (
        <img
          src={src}
          alt={alt}
          width={128}
          height={128}
          className="object-cover w-full h-full"
        />
      )}
    </motion.button>
  );
}
