import { AnimatePresence, motion } from "motion/react";

export default function FadeInFadeOut({
  children,
  isVisible,
  onExitComplete,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  onExitComplete: () => void;
}) {
  return (
    <AnimatePresence initial={true} mode="wait" onExitComplete={onExitComplete}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          key="box"
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
