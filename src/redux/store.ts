import { configureStore } from '@reduxjs/toolkit';
import activeChatReducer from './slice/activeChatSlice';
import messagesReducer from './slice/messagesSlice';
import { baseApi } from './apis/baseAPI';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    activeChat: activeChatReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
