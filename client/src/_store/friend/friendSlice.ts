import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { RootState } from "@/_store/store";

export interface FriendType {
  Channels: string[];
  onlineStatus: boolean;
  _id: string;
  username: string;
  user_unique_id: string;
  email: string;
  avatar: string;
  date: string;
  friends: string[];
}

type FriendState = {
  friends: FriendType[];
};

const initialState: FriendState = {
  friends: [],
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchFriends.fulfilled,
      (state, action: PayloadAction<FriendType[]>) => {
        state.friends = action.payload;
      }
    );
    builder.addCase(fetchFriends.rejected, (state) => {
      state.friends = [];
    });
  },
});

export const fetchFriends = createAsyncThunk(
  "friend/fetchFriends",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = (state as RootState).user.user;

      if (!user.id) return rejectWithValue([]);

      const response = await axios.get(`${SERVER_API_URL}/friend/list`, {
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

export default friendSlice.reducer;
