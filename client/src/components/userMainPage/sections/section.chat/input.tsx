import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { addMessage } from "@/_store/chat/chatSlice";
import IconButton from "@/components/img-containers/icon-button";
import FileUploadModal from "./FileUploadModal";

import "@/styles/pages/me/sections/chat.css";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const currentChatId = useAppSelector((state) => state.chat.currentChat);
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
    if (e.key === "Enter" && message.trim() && currentChatId) {
      e.preventDefault();
      await dispatch(
        addMessage({
          chatId: currentChatId,
          sender: user.id,
          content: message,
          type: "text",
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="input-container bg-friends">
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
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFiles([]);
        }}
        initialFiles={selectedFiles}
      />
    </div>
  );
}
