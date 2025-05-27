"use client";

import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import {
  MicOff,
  Headphones,
  Monitor,
  Settings,
  MoreHorizontal,
  PhoneOff,
  ChevronDown,
} from "lucide-react";
import { leftVoiceChat } from "@/_store/channel/channelSlice";

export function BottomPanel() {
  const user = useAppSelector((s) => s.user.info);
  const currentVoiceChat = useAppSelector((s) => s.channel.currentVoiceChat);
  const currentCategory = useAppSelector(
    (s) => s.channel.currentServerCategoryId
  );
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);
  const dispatch = useAppDispatch();

  const handleLeaveChat = () => {
    if (currentVoiceChat && currentCategory && currentChannel) {
      console.log("Leaving voice chat");
      dispatch(
        leftVoiceChat({
          userId: user.id,
          chatId: currentVoiceChat._id,
          categoryId: currentCategory,
          channelId: currentChannel._id,
        })
      );
    }
  };

  return (
    <div className="absolute flex items-center bottom-6 bg-[#1e1f22] rounded-2xl px-2 py-1.5 gap-1">
      {/* Muted Microphone with Dropdown */}
      <div className="flex items-center">
        <button className="muted-button">
          <MicOff className="h-6 w-6" />
        </button>
        <button className="muted-sub-options-button">
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Deafened Headphones with Dropdown */}
      <div className="flex items-center ml-1">
        <button className="muted-button">
          <Headphones className="h-6 w-6" />
        </button>
        <button className="muted-sub-options-button">
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Screen Share */}
      <button className="options-button">
        <Monitor className="h-6 w-6" />
      </button>

      {/* Settings */}
      <button className="options-button">
        <Settings className="h-6 w-6" />
      </button>

      {/* More Options */}
      <button className="options-button">
        <MoreHorizontal className="h-6 w-6" />
      </button>

      {/* Disconnect Call */}
      <button className="left-call-button" onClick={handleLeaveChat}>
        <PhoneOff className="h-6 w-6" />
      </button>
    </div>
  );
}
