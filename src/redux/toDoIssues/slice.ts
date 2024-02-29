import { createSlice } from "@reduxjs/toolkit";

export const toDoIssuesSlice = createSlice({
  name: "toDoIssues",
  initialState: { value: [] },
  reducers: {
    getToDoIssues(state, action) {
      state.value = action.payload;
    },
    nextPageToDoIssues(state, action) {
      state.value = [...state.value, ...action.payload];
    },
  },
});

export const { getToDoIssues, nextPageToDoIssues } = toDoIssuesSlice.actions;
