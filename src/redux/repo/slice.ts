import { createSlice } from '@reduxjs/toolkit';

export type StateRepo = {
  value: string;
};

const initialState: StateRepo = {
  value: '',
};

export const repoSlice = createSlice({
  name: 'repo',
  initialState: initialState,
  reducers: {
    getRepo(state, action) {
      state.value = action.payload;
    },
  },
});

export const { getRepo } = repoSlice.actions;
