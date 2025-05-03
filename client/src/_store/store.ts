import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import friendSlice from "./friend/friendSlice";

export const store = configureStore({
  reducer: {
    //auth: authSlice,
    user: userSlice,
    // chat: chatSlice,
    friend: friendSlice,
    // filterFriend: filterFriendSlice,
    // friendRequest: friendRequestSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
