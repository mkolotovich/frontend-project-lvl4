import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    getAllChannels: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { getAllChannels } = counterSlice.actions;

export default counterSlice.reducer;
