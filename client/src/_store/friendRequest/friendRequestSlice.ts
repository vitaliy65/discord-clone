import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { SERVER_API_URL } from "@/utils/constants";
import { socket } from "@/utils/socket";

// Types
export interface FriendRequestSender {
  sender: {
    _id: string;
    username: string;
    user_unique_id: string;
    email: string;
    avatar: string;
  };
  requestId: string;
}

export interface FriendRequestState {
  requests: FriendRequestSender[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendRequestState = {
  requests: [],
  loading: false,
  error: null,
};

// Async thunks
export const sendFriendRequest = createAsyncThunk(
  "friendRequest/send",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${SERVER_API_URL}/friendRequest/send`,
        { username },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      socket.emit("friend_request_send", { username });
      return response.data;
    } catch (error) {
      const errorResponse = (error as AxiosError).response;

      if (errorResponse && errorResponse.data) {
        const errorData = errorResponse.data as { error?: string };
        return rejectWithValue(
          errorData.error || "Failed to send friend request"
        );
      }
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friendRequest/accept",
  async (
    {
      requestId,
      receiverId,
      senderId,
    }: { requestId: string; receiverId: string; senderId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${SERVER_API_URL}/friendRequest/accept`,
        { requestId },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      socket.emit("accept_friend_request", { senderId, receiverId });
      return { requestId, data: response.data };
    } catch (error) {
      const errorResponse = (error as AxiosError).response;

      if (errorResponse && errorResponse.data) {
        const errorData = errorResponse.data as { error?: string };
        return rejectWithValue(
          errorData.error || "Failed to send friend request"
        );
      }
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "friendRequest/reject",
  async (requestId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${SERVER_API_URL}/friendRequest/reject`,
        { requestId },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return { requestId, data: response.data };
    } catch (error) {
      const errorResponse = (error as AxiosError).response;

      if (errorResponse && errorResponse.data) {
        const errorData = errorResponse.data as { error?: string };
        return rejectWithValue(
          errorData.error || "Failed to send friend request"
        );
      }
    }
  }
);

export const fetchFriendRequestList = createAsyncThunk(
  "friendRequest/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/friendRequest/list`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorResponse = (error as AxiosError).response;

      if (errorResponse && errorResponse.data) {
        const errorData = errorResponse.data as { error?: string };
        return rejectWithValue(
          errorData.error || "Failed to send friend request"
        );
      }
    }
  }
);

const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Send friend request
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Accept friend request
    builder
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(
          (request) => request.requestId !== action.payload?.requestId
        );
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reject friend request
    builder
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(
          (request) => request.requestId !== action.payload?.requestId
        );
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // get friend request list
    builder
      .addCase(fetchFriendRequestList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendRequestList.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchFriendRequestList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default friendRequestSlice.reducer;
