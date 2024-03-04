import { createSlice } from '@reduxjs/toolkit';
import { StateChanges, ActionChangesType, StateChangesItem } from 'types';

const initialState: StateChanges = {
  value: [],
};

export const changesSlice = createSlice({
  name: 'changes',
  initialState: initialState,
  reducers: {
    getChanges(state: StateChanges, action) {
      state.value = action.payload;
    },
    addChange(state: StateChanges, action: ActionChangesType) {
      const indexRepo = state.value?.findIndex((element) => element.repo === action.payload.repo);
      const indexId =
        indexRepo !== undefined
          ? state.value![indexRepo]?.data.findIndex((element) => element.id === action.payload.id)
          : undefined;

      const newItem: StateChangesItem = {
        repo: action.payload.repo,
        data: [
          {
            id: action.payload.id,
            columnIn: action.payload.columnIn,
            columnOut: action.payload.columnOut,
            issue: action.payload.issue,
          },
        ],
      };

      if (indexRepo === -1 || indexRepo === undefined) {
        state.value = [...state.value!, newItem];
      } else if (indexId === -1 || indexId === undefined) {
        state.value![indexRepo!].data = [...state.value![indexRepo!].data, newItem.data[0]];
      } else {
        const newData = [...state.value![indexRepo!].data];

        newData.splice(indexId!, 1);
        state.value![indexRepo!].data = [...newData, newItem.data[0]];
      }
    },
  },
});

export const { getChanges, addChange } = changesSlice.actions;
