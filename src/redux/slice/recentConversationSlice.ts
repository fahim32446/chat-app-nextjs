// src/store/slices/recentConversationSlice.ts
import { IRecentConversation, ISidebarPusherType } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecentConversationsState {
  recent: IRecentConversation[] | null;
}

const initialState: RecentConversationsState = {
  recent: null,
};

export const recentConversationSlice = createSlice({
  name: 'recentConversations',
  initialState,
  reducers: {
    setInitialConversations: (state, action: PayloadAction<IRecentConversation[]>) => {
      state.recent = action.payload;
    },
    // updateConversationFromPusher: (state, action: PayloadAction<ISidebarPusherType>) => {
    //   const newMessage = action.payload;
    //   const updated = state.recent?.map((conversation) => {
    //     if (conversation.conversationId === newMessage.conversationId) {
    //       return { ...conversation, lastMessage: newMessage.lastText };
    //     }
    //     return conversation;
    //   });

    //   state.recent =
    //     updated?.sort((a, b) => b.timestamp.localeCompare(a.timestamp)) ?? state.recent;
    // },

    updateConversationFromPusher: (state, action: PayloadAction<ISidebarPusherType>) => {
      const newMessage = action.payload;

      const updated = state.recent?.map((conversation) => {
        if (conversation.conversationId === newMessage.conversationId) {
          return {
            ...conversation,
            lastText: newMessage.lastText,
            timestamp: newMessage.timestamp, // ensure this is updated
          };
        }
        return conversation;
      });

      state.recent =
        updated?.sort((a, b) => b.timestamp.localeCompare(a.timestamp)) ?? state.recent;
    },
  },
});

export const { setInitialConversations, updateConversationFromPusher } =
  recentConversationSlice.actions;

export default recentConversationSlice.reducer;
