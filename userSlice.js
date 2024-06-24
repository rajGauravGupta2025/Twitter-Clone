import { createSlice } from '@reduxjs/toolkit';

// Define initial state for user slice
const initialState = {
  currentUser: null, // Initially no user is logged in
  isLoading: false,   // Initially not loading
  error: false,       // Initially no error
};

// Create user slice using createSlice function from Redux Toolkit
export const userSlice = createSlice({
  name: 'user',       // Slice name
  initialState,       // Initial state defined above
  reducers: {
    // Reducer to indicate login process has started
    loginStart: (state) => {
      state.isLoading = true; // Set isLoading to true
    },
    // Reducer to handle successful login
    loginSuccess: (state, action) => {
      state.isLoading = false;        // Set isLoading to false
      state.currentUser = action.payload; // Set current user based on payload
    },
    // Reducer to handle login failure
    loginFailed: (state) => {
      state.isLoading = false; // Set isLoading to false
      state.error = true;      // Set error to true
    },
    // Reducer to handle logout
    logout: (state) => {
      state.isLoading = false;  // Set isLoading to false
      return initialState;      // Reset state to initial state
    },
    // Reducer to update user information
    updateUser: (state, action) => {
      state.isLoading = false;        // Set isLoading to false
      state.currentUser = action.payload; // Update current user based on payload
    },
  },
});

// Extract action creators from user slice
export const { loginStart, loginFailed, logout, loginSuccess, updateUser } =
  userSlice.actions;

// Export user reducer
export default userSlice.reducer;
