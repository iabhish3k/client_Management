import persistedReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

const middlewares = [];

const store = configureStore({
  reducer: persistedReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: process.env.NODE_ENV === "development",
});

store.asyncReducers = {};

export const injectReducer = (key, reducer) => {
  if (store.asyncReducers[key]) {
    return false;
  }
  store.asyncReducers[key] = reducer;
  store.replaceReducer(persistedReducer(store.asyncReducers));
  return store;
};

export const persistor = persistStore(store);

export default store;
