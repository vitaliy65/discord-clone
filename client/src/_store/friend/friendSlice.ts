import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";

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
  selectedFriend: FriendType | null;
};

const initialState: FriendState = {
  friends: [],
  selectedFriend: null,
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setCurrentFriend: (state, action: PayloadAction<FriendType | null>) => {
      state.selectedFriend = action.payload;
    },
    removeCurrentFriend: (state) => {
      state.selectedFriend = null;
    },
    changeFriendOnlineStatus: (
      state,
      action: PayloadAction<{ friendId: string; status: boolean }>
    ) => {
      const { friendId, status } = action.payload;
      const friend = state.friends.find((f) => f._id === friendId);

      if (friend) {
        friend.onlineStatus = status;
      }

      if (state.selectedFriend != null && state.selectedFriend._id === friendId)
        state.selectedFriend.onlineStatus = status;
    },
  },
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
    builder.addCase(
      deleteFriend.fulfilled,
      (state, action: PayloadAction<FriendType>) => {
        state.friends = state.friends.filter(
          (friend) => friend._id !== action.payload._id
        );
      }
    );
  },
});

export const fetchFriends = createAsyncThunk(
  "friend/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
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

export const deleteFriend = createAsyncThunk(
  "friend/deleteFriend",
  async (friendId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${SERVER_API_URL}/friend/${friendId}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue([]);
    }
  }
);

export const {
  setCurrentFriend,
  removeCurrentFriend,
  changeFriendOnlineStatus,
} = friendSlice.actions;
export default friendSlice.reducer;
