import { createSlice } from "@reduxjs/toolkit";

// Try to safely parse localStorage data
const storedAuthData = localStorage.getItem('authData');
let authData = null;
try {
  if (storedAuthData) {
    authData = JSON.parse(storedAuthData);
  }
} catch (error) {
  console.error("Failed to parse authData:", error);
}

const initialState = {
  authData, // Set the initial state with parsed or null value
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(state, action) {
      state.authData = action.payload;
      localStorage.setItem("authData", JSON.stringify(action.payload)); // Safely save to localStorage
    },
    clearAuthData(state) {
      state.authData = null;
      localStorage.removeItem("authData"); // Remove from localStorage
    },
    logoutUser(state) {
      // Clear user data upon logout
      state.authData = null;
      localStorage.removeItem("authData"); // Clear localStorage data
    },
  },
});

export const { setAuthData, clearAuthData, logoutUser } = authSlice.actions;
export default authSlice.reducer;
