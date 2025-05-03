import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import friendSlice from "./friend/friendSlice";
import channelSlice from "./channel/channelSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    channel: channelSlice,
    // chat: chatSlice,
    friend: friendSlice,
    // filterFriend: filterFriendSlice,
    // friendRequest: friendRequestSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
