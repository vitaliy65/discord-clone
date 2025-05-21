import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { RootState } from "@/_store/store";
import {
  ChannelType,
  ChannelTextChatType,
  ChannelVoiceChatType,
  MessageType,
  ChannelMembers,
} from "@/types/types";
import { socket } from "@/utils/socket";

type ChannelState = {
  channels: ChannelType[];
  currentChannel: ChannelType | null;
  currentChat: ChannelTextChatType | ChannelVoiceChatType | null;
  activeChannelIndex: number;
};

const initialState: ChannelState = {
  channels: [],
  currentChannel: null,
  currentChat: null,
  activeChannelIndex: -1,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setCurrentChannel: (state, action: PayloadAction<string>) => {
      const foundChannel = state.channels.find(
        (channel) => channel._id === action.payload
      );

      if (!foundChannel) {
        console.warn(`Channel with id ${action.payload} not found`);
        state.currentChannel = null;
        return;
      }

      state.currentChannel = foundChannel;
    },
    setCurrentChat: (
      state,
      action: PayloadAction<ChannelTextChatType | ChannelVoiceChatType | null>
    ) => {
      state.currentChat = action.payload;
    },
    setActiveChannelIndex: (state, action: PayloadAction<number>) => {
      state.activeChannelIndex = action.payload;
    },
    addMessageToCurrentChat: (
      _,
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
        state.currentChat &&
        "messages" in state.currentChat &&
        state.currentChat._id === chatId
      ) {
        state.currentChat.messages.push(message);
      }

      // Update in channels array
      const channel = state.channels.find((ch) => ch._id === channelId);
      if (channel) {
        const chat = channel.textChats.find((chat) => chat._id === chatId);
        if (chat && "messages" in chat) {
          chat.messages.push(message);
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
    builder.addCase(
      fetchChannelMembers.fulfilled,
      (
        state,
        action: PayloadAction<{ channelId: string; data: ChannelMembers[] }>
      ) => {
        const { channelId, data } = action.payload;

        const channel = state.channels.find((ch) => ch._id === channelId);

        if (channel) channel.members = data;

        if (state.currentChannel && state.currentChannel._id === channelId) {
          state.currentChannel.members = data;
        }
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

export const fetchChannelMembers = createAsyncThunk(
  "friend/fetchChannelMembers",
  async (channelId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${SERVER_API_URL}/channel/${channelId}/members`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      return { channelId, data: response.data };
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
  addMessageToCurrentChat,
  setActiveChannelIndex,
  setCurrentChannel,
  setCurrentChat,
  receiveChannelMessage,
} = channelSlice.actions;
export default channelSlice.reducer;
