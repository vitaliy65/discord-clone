import { useState } from "react";
import { useAppSelector } from "@/_hooks/hooks";
import IconButton from "@/components/img-containers/icon-button";
import FileUploadModal from "./FileUploadModal";
import { UserType } from "@/types/types";

interface ChatInputProps {
  currentChatId: string;
  saveMessageFun: (
    user: UserType,
    message: string,
    type: "file" | "text" | "image" | "audio" | "video"
  ) => void;
}

export default function ChatInput({
  currentChatId,
  saveMessageFun,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const user = useAppSelector((state) => state.user.info);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setSelectedFiles(filesArray);
      setIsUploadModalOpen(true);
    }
  };

  const handleSendMessage = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();
      saveMessageFun(user, message, "text");
      setMessage("");
    }
  };

  return (
    <div className="input-container bg-friends border-channels">
      <div className="flex flex-row">
        <label className="file-input-label">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <IconButton src="/chat/paperclip.png" alt="Attach file" />
        </label>
        <input
          type="text"
          value={message}
          className="chat-input-field"
          placeholder="Type your message here..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>

      <FileUploadModal
        currentChatId={currentChatId}
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFiles([]);
        }}
        initialFiles={selectedFiles}
        saveMessageFun={saveMessageFun}
      />
    </div>
  );
}
