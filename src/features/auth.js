import { createSlice } from '@reduxjs/toolkit';
import { ACCOUNT_ID, SESSION_ID } from '../constants';

const initialState = {
  user: {},
  isAuthenticated: false,
  sessionId: '',
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionId = localStorage.getItem(SESSION_ID);
      localStorage.setItem(ACCOUNT_ID, action.payload.id);
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;

export const userSelector = (state) => state.user;
