import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 1,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    changeChannel: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeChannel } = counterSlice.actions;

export default counterSlice.reducer;
