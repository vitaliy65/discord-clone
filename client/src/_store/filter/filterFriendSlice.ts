import { createSlice } from "@reduxjs/toolkit";
import { filterFriendType } from "@/types/types";

const initialState: filterFriendType = {
  action: {
    showAll: true,
    showOnline: false,
    showPending: false,
    openAddFriendForm: false,
    searchParams: "",
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
    setSearchParams: (state, action) => {
      state.action.searchParams = action.payload;
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
  setSearchParams,
} = filterFriendSlice.actions;
export default filterFriendSlice.reducer;
