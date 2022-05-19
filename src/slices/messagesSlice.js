import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    getAllMessages: (state, action) => {
      state.value = action.payload;
    },
    sendMessage: (state, action) => {
      state.value.push(action.payload);
    },
  },
});

export const { getAllMessages, sendMessage } = counterSlice.actions;

export default counterSlice.reducer;
