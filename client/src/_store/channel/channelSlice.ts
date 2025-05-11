import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { RootState } from "@/_store/store";
import { ChannelType } from "@/types/types";

type ChannelState = {
  channels: ChannelType[];
};

const initialState: ChannelState = {
  channels: [],
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {},
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

export default channelSlice.reducer;
