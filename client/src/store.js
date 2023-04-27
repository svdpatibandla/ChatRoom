// import necessary modules
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

// combine reducers
const reducer = combineReducers({
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

// configure redux-persist settings
const persistConfig = {
  key: "root",
  storage,
  blackList: [appApi.reducerPath],
};

// persist the store using redux-persist
const persistedReducer = persistReducer(persistConfig, reducer);

// create the store with persistedReducer and necessary middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appApi.middleware],
});

// export the store
export default store;
