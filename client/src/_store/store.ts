import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import friendSlice from "./friend/friendSlice";
import channelSlice from "./channel/channelSlice";
import chatSlice from "./chat/chatSlice";
import filterFriendSlice from "./filter/filterFriendSlice";
import friendRequestSlice from "./friendRequest/friendRequestSlice";
import channelMembersSlice from "./channelMembers/channelMembersSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    channel: channelSlice,
    chat: chatSlice,
    friend: friendSlice,
    filter: filterFriendSlice,
    friendRequest: friendRequestSlice,
    channelMembers: channelMembersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
