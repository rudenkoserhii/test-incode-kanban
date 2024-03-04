import { createSlice } from '@reduxjs/toolkit';
import { ActionType, IssueType } from 'types';

const initialState: { value: IssueType[] } = {
  value: [],
};

export const inProgressIssuesSlice = createSlice({
  name: 'inProgressIssues',
  initialState: initialState,
  reducers: {
    getInProgressIssues(state, action: ActionType) {
      state.value = action.payload;
    },
    nextPageInProgressIssues(state, action: ActionType) {
      state.value = [...state.value, ...action.payload];
    },
  },
});

export const { getInProgressIssues, nextPageInProgressIssues } = inProgressIssuesSlice.actions;
