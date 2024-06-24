import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Importing userReducer from userSlice.js
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'; // Importing necessary functions/constants from redux-persist
import storage from 'redux-persist/lib/storage'; // Importing storage from redux-persist

// Configuration object for redux-persist
const persistConfig = {
  key: 'root', // Key for the persisted state
  version: 1, // Version of the persisted state
  storage, // Storage method (in this case, Redux storage)
};

// Combining reducers using combineReducers from Redux Toolkit
const rootReducer = combineReducers({ user: userReducer });

// Creating a persisted reducer using persistReducer from redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Creating a Redux store with persistedReducer and middleware
export const store = configureStore({
  reducer: persistedReducer, // Reducer with persistence
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Customizing middleware with serializableCheck
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignoring specific actions
      },
    }),
});

// Creating a persistor using persistStore from redux-persist
export const persistor = persistStore(store);
