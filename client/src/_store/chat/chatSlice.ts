import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";

export interface ChatType {
  chats: {
    chatId: string;
    participants: string[];
    messages: {
      sender: string;
      content: string;
    }[];
  }[];
  currentChat: string | null;
}

const initialState: ChatType = {
  chats: [],
  currentChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; sender: string; content: string }>
    ) => {
      const { chatId, sender, content } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.chatId === chatId);

      if (chatIndex !== -1) {
        state.chats[chatIndex].messages.push({ sender, content });
      } else {
        state.chats.push({
          chatId,
          messages: [{ sender, content }],
        });
      }
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
  },
});

// fetch user chats
export const fetchUserChats = createAsyncThunk(
  "chat/fetchUserChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/api/chat/list`, {
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

export const { addMessage, setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
