import { createSlice } from '@reduxjs/toolkit';
import { ActionType, IssueType } from 'types';

const initialState: { value: IssueType[] } = {
  value: [],
};

export const toDoIssuesSlice = createSlice({
  name: 'toDoIssues',
  initialState: initialState,
  reducers: {
    getToDoIssues(state, action: ActionType) {
      state.value = action.payload;
    },
    nextPageToDoIssues(state, action: ActionType) {
      state.value = [...state.value, ...action.payload];
    },
  },
});

export const { getToDoIssues, nextPageToDoIssues } = toDoIssuesSlice.actions;
