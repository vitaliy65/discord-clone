import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { RootState } from "@/_store/store";
import {
  ChannelType,
  ChannelTextChatType,
  ChannelVoiceChatType,
  MessageType,
  ChannelMember,
} from "@/types/types";
import { socket } from "@/utils/socket";

type ChannelState = {
  channels: ChannelType[];
  currentChannel: ChannelType | null;
  currentTextChat: ChannelTextChatType | null;
  currentServerCategoryId: string | null;
  currentVoiceChat: ChannelVoiceChatType | null;
  activeChannelIndex: number;
  isGuest: boolean;
};

const initialState: ChannelState = {
  channels: [],
  currentChannel: null,
  currentTextChat: null,
  currentVoiceChat: null,
  currentServerCategoryId: null,
  activeChannelIndex: -1,
  isGuest: false,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setCurrentChannelCategoryId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currentServerCategoryId = action.payload;
    },
    setCurrentChannelById: (state, action: PayloadAction<string>) => {
      const foundChannel = state.channels.find(
        (channel) => channel._id === action.payload
      );

      if (!foundChannel) {
        console.warn(`Channel with id ${action.payload} not found`);
        state.currentChannel = null;
        return;
      }

      state.isGuest = false;
      state.currentChannel = foundChannel;
    },
    setCurrentChannel: (state, action: PayloadAction<ChannelType>) => {
      state.currentChannel = action.payload;
      state.isGuest = !state.channels.some(
        (channel) => channel._id === action.payload._id
      );
    },
    setCurrentTextChat: (
      state,
      action: PayloadAction<ChannelTextChatType | null>
    ) => {
      state.currentTextChat = action.payload;
    },
    setActiveChannelIndex: (state, action: PayloadAction<number>) => {
      state.activeChannelIndex = action.payload;
    },
    setIsGuest: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
    },
    addMessageToCurrentChat: (
      state,
      action: PayloadAction<{
        channelId: string;
        chatId: string;
        sender: string;
        content: string;
        type: "file" | "text" | "image" | "audio" | "video";
      }>
    ) => {
      const { channelId, chatId, sender, type, content } = action.payload;

      socket.emit("channel_send_message", {
        channelId: channelId,
        categoryId: state.currentServerCategoryId,
        chatId: chatId,
        content: content,
        type: type,
        senderId: sender,
      });
    },
    receiveChannelMessage: (
      state,
      action: PayloadAction<{
        channelId: string;
        chatId: string;
        message: MessageType;
      }>
    ) => {
      const { channelId, chatId, message } = action.payload;
      // Update in currentChat
      if (
        state.currentTextChat &&
        "messages" in state.currentTextChat &&
        state.currentTextChat._id === chatId
      ) {
        state.currentTextChat.messages.push(message);
      }

      // Update in channels array
      const channel = state.channels.find((ch) => ch._id === channelId);
      if (channel) {
        // Шукаємо чат в усіх категоріях
        for (const category of channel.categories) {
          const chat = category.textChats.find((chat) => chat._id === chatId);
          if (chat && "messages" in chat) {
            chat.messages.push(message);
            break;
          }
        }
      }
    },
    addChannel: (state, action: PayloadAction<ChannelType>) => {
      state.channels.push(action.payload);
    },
    addChannelMember: (
      state,
      action: PayloadAction<{ channelId: string; newMember: ChannelMember }>
    ) => {
      const { channelId, newMember } = action.payload;
      const channel = state.channels.find((ch) => ch._id === channelId);
      if (channel) {
        channel.members.push(newMember);
      }
      if (state.currentChannel?._id === channelId) {
        state.currentChannel.members.push(newMember);
      }
    },
    userJoinedVoiceChat: (
      state,
      action: PayloadAction<{
        userId: string;
        chatId: string;
        categoryId: string;
        channelId: string;
      }>
    ) => {
      const { chatId, categoryId, channelId, userId } = action.payload;

      const newConnectedUser = {
        _id: userId,
        joinedAt: new Date().toISOString(),
        voiceState: {
          muted: false,
          deafened: false,
          videoEnabled: false,
          screenSharing: false,
        },
      };

      const channel = state.channels.find((ch) => ch._id === channelId);
      const category = channel?.categories.find(
        (cat) => cat._id === categoryId
      );
      const voiceChat = category?.voiceChats.find(
        (chat) => chat._id === chatId
      );

      if (voiceChat) {
        // Перевіряємо, чи користувач вже існує
        const userExists = voiceChat.connectedUsers.some(
          (user) => user._id === userId
        );

        if (!userExists) {
          // Додаємо користувача тільки якщо його ще немає
          voiceChat.connectedUsers.push(newConnectedUser);

          // Оновлюємо currentVoiceChat, якщо це поточний чат
          if (state.currentVoiceChat?._id === chatId) {
            state.currentVoiceChat.connectedUsers = [
              ...voiceChat.connectedUsers,
            ];
          }
        }
      }
    },
    userLeftVoiceChat: (
      state,
      action: PayloadAction<{
        userId: string;
        chatId: string;
        categoryId: string;
        channelId: string;
      }>
    ) => {
      const { chatId, categoryId, channelId, userId } = action.payload;

      const channel = state.channels.find((ch) => ch._id === channelId);
      const category = channel?.categories.find(
        (cat) => cat._id === categoryId
      );
      const voiceChat = category?.voiceChats.find(
        (chat) => chat._id === chatId
      );

      if (voiceChat) {
        voiceChat.connectedUsers = voiceChat.connectedUsers.filter(
          (user) => user._id !== userId
        );

        if (state.currentVoiceChat?._id === chatId) {
          state.currentVoiceChat.connectedUsers =
            state.currentVoiceChat.connectedUsers.filter(
              (user) => user._id !== userId
            );
        }
      }
    },
    joinVoiceChat: (
      state,
      action: PayloadAction<{
        voiceChat: ChannelVoiceChatType;
        userId: string;
        chatId: string;
        categoryId: string;
        channelId: string;
      }>
    ) => {
      const { voiceChat, chatId, categoryId, channelId, userId } =
        action.payload;

      state.currentVoiceChat = voiceChat;

      socket.emit("channel_user_join_voice_chat", {
        channelId: channelId,
        categoryId: categoryId,
        chatId: chatId,
        userId: userId,
      });
    },
    leftVoiceChat: (
      state,
      action: PayloadAction<{
        userId: string;
        chatId: string;
        categoryId: string;
        channelId: string;
      }>
    ) => {
      const { chatId, categoryId, channelId, userId } = action.payload;

      state.currentVoiceChat = null;

      socket.emit("channel_user_left_voice_chat", {
        channelId: channelId,
        categoryId: categoryId,
        chatId: chatId,
        userId: userId,
      });
    },
    setOnlineStatusOnServer: (
      state,
      action: PayloadAction<{
        channelId: string;
        memberId: string;
        status: boolean;
      }>
    ) => {
      const { channelId, memberId, status } = action.payload;
      const channel = state.channels.find((ch) => ch._id === channelId);
      if (channel) {
        const member = channel.members.find((m) => m.user._id === memberId);
        if (member) {
          member.user.onlineStatus = status;
        }
      }
      if (state.currentChannel?._id === channelId) {
        const currentMember = state.currentChannel.members.find(
          (m) => m.user._id === memberId
        );
        if (currentMember) {
          currentMember.user.onlineStatus = status;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchChannels.fulfilled,
      (state, action: PayloadAction<ChannelType[]>) => {
        state.channels = action.payload;
      }
    );
    builder.addCase(fetchChannels.rejected, (state) => {
      state.channels = [];
    });
    builder.addCase(
      createChannel.fulfilled,
      (state, action: PayloadAction<ChannelType>) => {
        state.channels.push(action.payload);
      }
    );
  },
});

export const fetchChannels = createAsyncThunk(
  "friend/fetchChannels",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = (state as RootState).user.info;

      if (!user.id) return rejectWithValue([]);

      const response = await axios.get(`${SERVER_API_URL}/channel/list`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue([]);
    }
  }
);

export const createChannel = createAsyncThunk(
  "channel/createChannel",
  async (
    channelData: {
      name: string;
      description: string;
      avatar: string;
      public: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_API_URL}/channel/create`,
        channelData,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to create channel");
    }
  }
);

export const {
  setCurrentChannelCategoryId,
  addMessageToCurrentChat,
  setActiveChannelIndex,
  setCurrentChannelById,
  setCurrentChannel,
  setCurrentTextChat,
  receiveChannelMessage,
  addChannelMember,
  addChannel,
  setIsGuest,
  userJoinedVoiceChat,
  setOnlineStatusOnServer,
  userLeftVoiceChat,
  joinVoiceChat,
  leftVoiceChat,
} = channelSlice.actions;
export default channelSlice.reducer;
