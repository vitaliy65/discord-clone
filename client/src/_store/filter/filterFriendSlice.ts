import { createSlice } from "@reduxjs/toolkit";

type filterFriendState = {
  action: {
    showAll: boolean;
    showOnline: boolean;
    showPending: boolean;
    openAddFriendForm: boolean;
  };
};

const initialState: filterFriendState = {
  action: {
    showAll: true,
    showOnline: false,
    showPending: false,
    openAddFriendForm: false,
  },
};

const filterFriendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setShowAll: (state) => {
      state.action.showAll = true;
      state.action.showOnline = false;
    },
    setShowOnline: (state) => {
      state.action.showAll = false;
      state.action.showOnline = true;
    },
    setShowPending: (state) => {
      state.action.showPending = true;
    },
    setHidePending: (state) => {
      state.action.showPending = false;
    },
    setOpenAddFriendForm: (state) => {
      state.action.openAddFriendForm = true;
    },
    setCloseAddFriendForm: (state) => {
      state.action.openAddFriendForm = false;
    },
  },
});

export const {
  setShowAll,
  setShowOnline,
  setShowPending,
  setOpenAddFriendForm,
  setCloseAddFriendForm,
  setHidePending,
} = filterFriendSlice.actions;
export default filterFriendSlice.reducer;
