import { AnimatePresence, motion } from "motion/react";
import "@/styles/animated-components/pop-up.css";

export default function PopUpContainer({
  text,
  buttonText,
  isVisible,
  onClickAccept,
  onClickCancel,
}: {
  text: string;
  buttonText: string;
  isVisible: boolean;
  onClickAccept: () => void;
  onClickCancel: () => void;
}) {
  return (
    <AnimatePresence initial={true} mode="wait">
      {isVisible ? (
        <div className="popup-bg" onClick={onClickCancel}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, scale: 0 }}
            className="popup-menu bg-friends"
          >
            <p className="text-center">{text}</p>
            <div className="flex gap-4">
              <button
                onClick={onClickAccept}
                className="popup-menu-button-accept"
              >
                {buttonText}
              </button>
              <button
                onClick={onClickCancel}
                className="popup-menu-button-cancel"
              >
                отменить
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
