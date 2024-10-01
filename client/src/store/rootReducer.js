import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import auth from "./authSlice";

// Create persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only these slices will be persisted
};

// Combine your reducers
const rootReducer = (asyncReducers) =>
  combineReducers({
    auth,
    ...asyncReducers,
  });

// Wrap your rootReducer with persistReducer
const persistedReducer = (asyncReducers) =>
  persistReducer(persistConfig, rootReducer(asyncReducers));

export default persistedReducer;
