import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useAppDispatch } from "@/_hooks/hooks";
import { createChannel } from "@/_store/channel/channelSlice";
import { ModalOverlay } from "./modal/ModalOverlay";
import { ModalInput } from "./modal/ModalInput";
import { ModalTextArea } from "./modal/ModalTextArea";
import { ModalAvatarInput } from "./modal/ModalAvatarInput";
import { ModalButtons } from "./modal/ModalButtons";
import ModalPublicSelector from "./modal/ModalPublicSelector";

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddChannelModal({
  isOpen,
  onClose,
}: AddChannelModalProps) {
  const dispatch = useAppDispatch();
  const [channelData, setChannelData] = useState({
    name: "",
    description: "",
    public: true,
    avatar: `/channels/background/group-${
      Math.floor(Math.random() * 3) + 1
    }.png`,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelData.name.trim() || !channelData.description.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      await dispatch(createChannel(channelData));
      onClose();
      setChannelData({
        name: "",
        description: "",
        public: true,
        avatar: `/channels/background/group-${
          Math.floor(Math.random() * 3) + 1
        }.png`,
      });
      setError("");
    } catch (err) {
      setError("Failed to create channel");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <h2 className="channel-modal__title">Create Channel</h2>
          <form onSubmit={handleSubmit} className="channel-modal__form">
            <ModalAvatarInput
              onChange={(value) =>
                setChannelData((prev) => ({ ...prev, avatar: value }))
              }
            />

            <ModalInput
              label="Channel Name"
              value={channelData.name}
              onChange={(value) =>
                setChannelData((prev) => ({ ...prev, name: value }))
              }
              placeholder="Enter channel name"
            />

            <ModalTextArea
              label="Description"
              value={channelData.description}
              onChange={(value) =>
                setChannelData((prev) => ({ ...prev, description: value }))
              }
              placeholder="Enter channel description"
            />

            <div className="channel-modal__info">
              <p>The following will be created automatically:</p>
              <ul className="channel-modal__info-list">
                <li>Text channel: #general</li>
                <li>Voice channel: Group</li>
              </ul>
            </div>

            <ModalPublicSelector
              value={channelData.public}
              onChange={(value: boolean) =>
                setChannelData((prev) => ({ ...prev, public: value }))
              }
            />

            {error && <p className="channel-modal__error">{error}</p>}

            <ModalButtons onCancel={onClose} onSubmit={handleSubmit} />
          </form>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}
