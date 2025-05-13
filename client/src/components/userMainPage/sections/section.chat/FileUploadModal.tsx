import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { addMessage } from "@/_store/chat/chatSlice";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { getFileType } from "@/utils/constants";

import "@/styles/pages/me/sections/messages/imageMessage.css";
import "@/styles/pages/me/sections/messages/fileMessage.css";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFiles: File[];
}

export default function FileUploadModal({
  isOpen,
  onClose,
  initialFiles,
}: FileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.info);
  const currentChatId = useAppSelector((state) => state.chat.currentChat);

  useEffect(() => {
    if (isOpen) {
      setSelectedFiles(initialFiles);
    }
  }, [isOpen, initialFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleSendFiles = async () => {
    if (!currentChatId || selectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append("chatId", currentChatId);

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`${SERVER_API_URL}/upload`, formData, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      // Ensure fileUrls is always an array
      const fileUrls = response.data.urls;

      fileUrls.forEach(async (url: string, index: number) => {
        await dispatch(
          addMessage({
            chatId: currentChatId,
            sender: user.id,
            content: url,
            type: getFileType(selectedFiles[index]),
          })
        );
      });
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="selected-files-modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="selected-files-modal-container bg-friends"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* modal title */}
            <h3 className="selected-files-modal-title">Upload Files</h3>

            {/* modal files list */}
            <div className="selected-files scrollbar-small">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item bg-channels">
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={() =>
                      setSelectedFiles((files) =>
                        files.filter((_, i) => i !== index)
                      )
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* modal buttons */}
            <div className="flex gap-4 justify-between">
              <input
                type="file"
                multiple
                className="hidden"
                id="file-input"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="file-input"
                className="selected-files-buttons hover:bg-message"
              >
                Add Files
              </label>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="selected-files-buttons hover:bg-message"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendFiles}
                  className="selected-files-buttons hover:bg-message"
                  disabled={selectedFiles.length === 0}
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
