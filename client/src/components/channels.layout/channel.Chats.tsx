import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import Voice from "@/assets/icons/voice";
import Hashtag from "@/assets/icons/hashtag";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChannelTextChatType, ChannelVoiceChatType } from "@/types/types";
import {
  setCurrentChannelCategoryId,
  setCurrentChat,
} from "@/_store/channel/channelSlice";
import ListArrow from "@/assets/icons/listArrow";
import PlusWithoutBg from "@/assets/icons/plusWithoutBg";
import TextPopUpWhenHover from "../animatedComponents/textPopUpWhenHover";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";

export default function ChannelChats() {
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [hideCategoryChats, setHideCategoryChats] = useState<{
    [key: string]: boolean;
  }>({});

  const [showLable, setShowLable] = useState<string>();

  useEffect(() => {
    if (currentChannel) {
      const initialCategories = currentChannel.categories.reduce(
        (acc, category) => {
          acc[category._id] = false;
          return acc;
        },
        {} as { [key: string]: boolean }
      );
      setHideCategoryChats(initialCategories);
    }
  }, [currentChannel]);

  const handleChatSelect = (
    chat: ChannelTextChatType | ChannelVoiceChatType,
    categoryId: string
  ) => {
    if ("_id" in chat) {
      setSelectedChatId(chat._id);
      dispatch(setCurrentChat(chat));
      dispatch(setCurrentChannelCategoryId(categoryId));
      navigator(`/channels/${currentChannel?._id}/${chat._id}`, {
        replace: true,
      });
    }
  };

  return (
    <div className="channel-chats-container bg-channels border-section">
      <div className="channel-upper-section border-section">
        <span>{currentChannel?.name}</span>
      </div>

      {currentChannel && (
        <div className="friend-section-container scrollbar-small">
          {currentChannel.categories.map((category) => (
            <div className="w-full">
              {/* ----- section title ----- */}
              <div
                className="chat-category"
                onClick={() => {
                  setHideCategoryChats((prev) => ({
                    ...prev,
                    [category._id]: !prev[category._id],
                  }));
                }}
              >
                <div className="flex flex-row items-center justify-center gap-2">
                  <p>{category.name}</p>
                  <ListArrow
                    rotate={hideCategoryChats[category._id]}
                    initialAngle={0}
                    angle={-90}
                    size="16px"
                  />
                </div>
                <div
                  onMouseEnter={() => setShowLable(category._id)}
                  onMouseLeave={() => setShowLable("")}
                  onClick={(e) => e.stopPropagation()}
                >
                  <TextPopUpWhenHover
                    isHovered={showLable === category._id}
                    text="Create channel"
                  />
                  <PlusWithoutBg />
                </div>
              </div>

              {/* ----- render chats ----- */}
              {!hideCategoryChats[category._id] && (
                <div className="w-full">
                  {/* ----- text chats ----- */}
                  {category.textChats.length !== 0 && (
                    <div className="chats-section">
                      {category.textChats.map((textChat) => (
                        <div
                          key={textChat._id}
                          className={`chat-item ${
                            selectedChatId === textChat._id
                              ? "chat-item--selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleChatSelect(textChat, category._id)
                          }
                        >
                          <div className="text-chat">
                            <Hashtag className="h-6 w-6" />
                            <p>{textChat.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* ----- voice chats ----- */}
                  {category.voiceChats.length !== 0 && (
                    <div className="chats-section">
                      {category.voiceChats.map((voiceChat) => (
                        <div
                          key={voiceChat._id}
                          className={`chat-item ${
                            selectedChatId === voiceChat._id
                              ? "chat-item--selected"
                              : ""
                          }`}
                          onClick={async () => {
                            handleChatSelect(voiceChat, category._id);
                            await axios.post(
                              `${SERVER_API_URL}/channel/server-voice-chat/join`,
                              {
                                chatId: voiceChat._id,
                                categoryId: category._id,
                                channelId: currentChannel?._id,
                              },
                              {
                                headers: {
                                  Authorization: localStorage.getItem("token"),
                                },
                              }
                            );
                          }}
                        >
                          <div className="voice-chat">
                            <Voice className="h-6 w-6" />
                            <p>{voiceChat.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
