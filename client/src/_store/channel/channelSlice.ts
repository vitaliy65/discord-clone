import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { RootState } from "@/_store/store";
import { ChannelType } from "@/types/types";

type ChannelState = {
  channels: ChannelType[];
  currentChannel: ChannelType | null;
};

const initialState: ChannelState = {
  channels: [],
  currentChannel: null,
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

export const { setCurrentChannel } = channelSlice.actions;
export default channelSlice.reducer;
