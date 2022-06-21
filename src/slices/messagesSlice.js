import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    getAllMessages: (state, action) => {
      const newState = state;
      newState.messages = action.payload;
    },
    sendMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeChannelMessages: (state, action) => {
      const newState = state;
      const { id } = action.payload;
      const filteredMessages = state.messages.filter((el) => el.channelId !== id);
      newState.messages = filteredMessages;
    },
  },
});

export const { getAllMessages, sendMessage, removeChannelMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
