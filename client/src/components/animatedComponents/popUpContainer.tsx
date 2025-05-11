import { AnimatePresence, motion } from "motion/react";
import "@/styles/animated-components/pop-up.css";
import Input from "../auth/custom.input";
import { useState } from "react";

export default function PopUpContainer({
  text,
  buttonText,
  isVisible,
  hasInput,
  inputErrorPlaceHolder,
  onAnimationEnd,
  onClickAccept,
  onClickCancel,
}: {
  text: string;
  buttonText: string;
  isVisible: boolean;
  hasInput?: boolean;
  inputErrorPlaceHolder?: string;
  onAnimationEnd?: () => void;
  onClickAccept: (prop?: string) => void;
  onClickCancel: () => void;
}) {
  const [username, setUsername] = useState("");

  const handleAccept = () => {
    if (hasInput) {
      onClickAccept(username);
    } else {
      onClickAccept();
    }
  };

  return (
    <AnimatePresence initial={true} mode="wait" onExitComplete={onAnimationEnd}>
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
            {hasInput && inputErrorPlaceHolder != null && (
              <Input
                type="text"
                name="username"
                lable={inputErrorPlaceHolder}
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <div className="flex justify-between w-full gap-4">
              <button
                onClick={handleAccept}
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
