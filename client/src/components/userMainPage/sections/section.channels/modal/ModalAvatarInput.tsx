import { handleSendFile } from "@/utils/functions";
import { useState } from "react";

interface ModalAvatarInputProps {
  onChange: (value: string) => void;
}

export const ModalAvatarInput = ({ onChange }: ModalAvatarInputProps) => {
  const [imagebg, setImagebg] = useState<string>(
    "/channels/channel-add-avatar.png"
  );
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleSendFile(file).then((res) => {
        onChange(res[0]);
        setImagebg(res[0]);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleSendFile(e.target.files[0]).then((res) => {
        onChange(res[0]);
        setImagebg(res[0]);
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="channel-modal__avatar-container"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleChange(e)}
        />
        <label htmlFor="avatar" className="channel-modal__avatar">
          <img
            src={imagebg}
            alt="Channel avatar"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </label>
      </div>
      <label className="channel-modal__field">Channel Avatar</label>
    </div>
  );
};
