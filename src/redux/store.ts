import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './apis/baseAPI';
import activeChatReducer from './slice/activeChatSlice';
import messagesReducer from './slice/messagesSlice';
import onlineUserSliceReducer from './slice/onlineUsersSlice';
import recentConversationReducer from './slice/recentConversationSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    activeChat: activeChatReducer,
    messages: messagesReducer,
    recentConversation: recentConversationReducer,
    onlineUser: onlineUserSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
