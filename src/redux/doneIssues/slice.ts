import { createSlice } from '@reduxjs/toolkit';
import { ActionType, IssueType } from '../../types';

const initialState: { value: IssueType[] } = {
  value: [],
};

export const doneIssuesSlice = createSlice({
  name: 'doneIssues',
  initialState: initialState,
  reducers: {
    getDoneIssues(state, action: ActionType) {
      state.value = action.payload;
    },
    nextPageDoneIssues(state, action: ActionType) {
      state.value = [...state.value, ...action.payload];
    },
  },
});

export const { getDoneIssues, nextPageDoneIssues } = doneIssuesSlice.actions;
