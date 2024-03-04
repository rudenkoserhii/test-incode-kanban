import { UnknownAction, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { toDoIssuesSlice } from './toDoIssues/slice';
import { inProgressIssuesSlice } from './inProgressIssues/slice';
import { doneIssuesSlice } from './doneIssues/slice';
import { changesSlice } from './changes/slice';
import { repoSlice, StateRepo } from './repo/slice';
import { StateChanges } from 'types';

export type RootState = ReturnType<typeof store.getState>;

const changesPersistConfig: PersistConfig<StateChanges> = {
  key: 'changes',
  storage,
};

const repoPersistConfig: PersistConfig<StateRepo> = {
  key: 'repo',
  storage,
};

export const store = configureStore({
  reducer: {
    changes: persistReducer<StateChanges, UnknownAction>(
      changesPersistConfig,
      changesSlice.reducer
    ),
    repo: persistReducer<StateRepo, UnknownAction>(repoPersistConfig, repoSlice.reducer),
    toDoIssues: toDoIssuesSlice.reducer,
    inProgressIssues: inProgressIssuesSlice.reducer,
    doneIssues: doneIssuesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
