import { ConversationParticipant, Message } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessagesState {
  messages: Message[];
  ConversationParticipant?: ConversationParticipant[];
}

const initialState: MessagesState = {
  messages: [],
  ConversationParticipant: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    setParticipant(state, action: PayloadAction<ConversationParticipant[] | undefined>) {
      state.ConversationParticipant = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{ timestamp: Date; status: 'sent' | 'failed' }>
    ) {
      const { timestamp, status } = action.payload;
      const message = state.messages.find((msg) => msg.timestamp === timestamp);
      if (message) {
        message.status = status;
      }
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, updateMessageStatus, clearMessages, setParticipant } =
  messagesSlice.actions;

export default messagesSlice.reducer;
