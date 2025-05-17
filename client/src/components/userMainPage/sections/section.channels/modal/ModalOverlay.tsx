import { motion } from "motion/react";

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const ModalOverlay = ({ children, onClose }: ModalOverlayProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="channel-modal__overlay"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="channel-modal__content"
    >
      {children}
    </motion.div>
  </motion.div>
);
