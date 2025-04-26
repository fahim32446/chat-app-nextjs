import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IActiveChat {
  friendId?: string;
  conversationId?: string;
}

const initialState: IActiveChat = {};

export const activeChatSlice = createSlice({
  name: 'activeChat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<IActiveChat>) => {
      state.friendId = action.payload.friendId;
      state.conversationId = action.payload.conversationId;
    },
    clearActiveChat: () => {
      return {};
    },
  },
});

export const { setActiveChat, clearActiveChat } = activeChatSlice.actions;

export default activeChatSlice.reducer;
