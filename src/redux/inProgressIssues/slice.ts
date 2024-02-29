import { createSlice } from "@reduxjs/toolkit";

export const inProgressIssuesSlice = createSlice({
  name: "inProgressIssues",
  initialState: { value: [] },
  reducers: {
    getInProgressIssues(state, action) {
      state.value = action.payload;
    },
    nextPageInProgressIssues(state, action) {
      state.value = [...state.value, ...action.payload];
    },
  },
});

export const { getInProgressIssues, nextPageInProgressIssues } =
  inProgressIssuesSlice.actions;
