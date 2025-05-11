import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { UserType } from "@/types/types";

// Initial state
const initialState = {
  info: {} as UserType,
};

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.info.onlineStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        // Update the user state with the fetched data
        state.info = action.payload;
      })
      .addCase(fetchUserData.rejected, (_, action) => {
        console.error("Failed to fetch user data", action.error);
      });
  },
});

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async () => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/users/current`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
);

export const { setOnlineStatus } = userSlice.actions;
export default userSlice.reducer;
