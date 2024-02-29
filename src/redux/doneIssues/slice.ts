import { createSlice } from "@reduxjs/toolkit";

export const doneIssuesSlice = createSlice({
  name: "doneIssues",
  initialState: { value: [] },
  reducers: {
    getDoneIssues(state, action) {
      state.value = action.payload;
    },
    nextPageDoneIssues(state, action) {
      state.value = [...state.value, ...action.payload];
    },
  },
});

export const { getDoneIssues, nextPageDoneIssues } = doneIssuesSlice.actions;
