import { ChannelMember } from "@/types/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";
// import { socket } from "@/utils/socket";

type ChannelMembersState = {
  channels: { _id: string; members: ChannelMember[] }[];
  selectedChannel: { _id: string; members: ChannelMember[] } | null;
};

const initialState: ChannelMembersState = {
  channels: [],
  selectedChannel: null,
};

const channelMemberslSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setNewChannel(state, action: PayloadAction<string>) {
      // Додаємо новий канал з учасниками до списку каналів, якщо його ще немає
      const exists = state.channels.some((ch) => ch._id === action.payload);
      if (!exists) {
        state.channels.push({
          _id: action.payload,
          members: [],
        });
      }
    },
    addServerMember(
      state,
      action: PayloadAction<{ channelId: string; member: ChannelMember }>
    ) {
      const channel = state.channels.find(
        (ch) => ch._id === action.payload.channelId
      );
      if (channel) {
        channel.members.push(action.payload.member);
      }
      if (state.selectedChannel?._id === action.payload.channelId) {
        state.selectedChannel.members.push(action.payload.member);
      }
    },
    setSelectedChannel(state, action: PayloadAction<string>) {
      const selected = state.channels.find((c) => c._id === action.payload);

      if (selected) state.selectedChannel = selected;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchChannelMembers.fulfilled,
      (
        state,
        action: PayloadAction<{ channelId: string; data: ChannelMember[] }>
      ) => {
        const { channelId, data } = action.payload;

        const channel = state.channels.find((ch) => ch._id === channelId);

        if (channel) channel.members = data;
      }
    );
  },
});

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

export const { setNewChannel, setSelectedChannel, addServerMember } =
  channelMemberslSlice.actions;
export default channelMemberslSlice.reducer;
