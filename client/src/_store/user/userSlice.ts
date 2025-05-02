import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";

// Define the state type
export interface UserState {
  user: {
    id: string;
    email: string;
    username: string;
    user_unique_id: string;
    avatar: string;
    onlineStatus: string;
    friends: string[];
    FriendRequests: string[];
    channels: string[];
  };
}

// Initial state
const initialState: UserState = {
  user: {
    id: "",
    email: "",
    username: "",
    user_unique_id: "",
    avatar: "",
    onlineStatus: "",
    friends: [],
    channels: [],
    FriendRequests: [],
  },
};

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        // Update the user state with the fetched data
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        // Handle error state if needed
        state.user = initialState.user; // Reset to initial state on error
        console.error("Failed to fetch user data:", action.error);
      });
  },
});

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (token: string) => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/users/current`, {
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch user data");
    }
  }
);

export default userSlice.reducer;
