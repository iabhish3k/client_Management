import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";

const initialState = {
  token: secureLocalStorage.getItem("token") || null,
  role: secureLocalStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      secureLocalStorage.setItem("token", action.payload.token);
      secureLocalStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      secureLocalStorage.removeItem("token");
      secureLocalStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectRole = (state) => state.auth.role;
export default authSlice.reducer;
