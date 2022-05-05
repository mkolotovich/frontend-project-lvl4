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
  },
});

export const { getAllMessages } = counterSlice.actions;

export default counterSlice.reducer;
