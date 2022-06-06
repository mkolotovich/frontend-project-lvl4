import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    getAllMessages: (state, action) => {
      const newState = state;
      newState.value = action.payload;
    },
    sendMessage: (state, action) => {
      state.value.push(action.payload);
    },
    removeChannelMessages: (state, action) => {
      const newState = state;
      const { id } = action.payload;
      const filteredMessages = state.value.filter((el) => el.channelId !== id);
      newState.value = filteredMessages;
    },
  },
});

export const { getAllMessages, sendMessage, removeChannelMessages } = counterSlice.actions;

export default counterSlice.reducer;
