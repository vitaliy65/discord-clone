import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { socket } from "@/utils/socket";
import { MessageType, ChatType } from "@/types/types";

const initialState: ChatType = {
  chats: [],
  currentChat: null,
  currentChatMessages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (
      _,
      action: PayloadAction<{ chatId: string; sender: string; content: string }>
    ) => {
      const { chatId, sender, content } = action.payload;
      // Only emit to Socket.IO, don't add locally
      socket.emit("send_message", {
        chatId: chatId,
        content: content,
        senderId: sender,
      });
    },
    reciveMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: MessageType }>
    ) => {
      const { chatId, message } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].messages.push(message);
        state.currentChatMessages.push(message);
      } else {
        console.error("Chat not found");
      }
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setCurrentChatMessages: (state, action) => {
      const chatId = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1) {
        state.currentChatMessages = state.chats[chatIndex].messages;
      } else {
        console.error("Chat not found");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.chats = [];
      });
  },
});

// fetch user chats
export const fetchChats = createAsyncThunk(
  "chat/fetchUserChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/chat/list`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue([]);
    }
  }
);

export const {
  addMessage,
  setCurrentChat,
  setCurrentChatMessages,
  reciveMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
