import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnlineUsersState {
  users: string[];
}

const initialState: OnlineUsersState = {
  users: [],
};

const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<string[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<string>) => {
      if (!state.users.find((u) => u === action.payload)) {
        state.users.push(action.payload);
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u !== action.payload);
    },
  },
});

export const { setUsers, addUser, removeUser } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
