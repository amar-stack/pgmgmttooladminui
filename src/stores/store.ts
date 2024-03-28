/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createWrapper } from 'next-redux-wrapper';
import { AUTH_TOKEN_SAVE_FULFILLED, authSlice, LOGIN_BASE_SAVE_FULFILLED } from './authSlice';
import darkModeReducer from './darkModeSlice'

const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
  blacklist: ['auth', 'darkMode']
}

const authPersistConfig = {
  key: 'auth',
  version: 1,
  storage: storage,
  blacklist: []
}

export const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice.reducer),
  darkMode: darkModeReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const storeMiddleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
        AUTH_TOKEN_SAVE_FULFILLED,
        LOGIN_BASE_SAVE_FULFILLED
      ],
    }
  });

const store = configureStore({
  reducer: persistedReducer,
  middleware: storeMiddleware,
  devTools: true,
})

const makeStore = () => store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

export const wrapper = createWrapper<AppStore>(makeStore);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export interface ThunkAPI {
  state: RootState;
  dispatch: AppDispatch;
}

export const persistor = persistStore(store);

export default store;