import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

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
    addChannel: (state, action) => {
      state.value.push(action.payload);
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;
      const filteredChannels = state.value.filter((el) => el.id !== id);
      state.value = filteredChannels;
    },
    renameChannel: (state, action) => {
      const channel = action.payload;
      const updatedTodosArray = produce(state.value , draft => {
        const index = draft.findIndex(todo => todo.id === channel.id)
        if (index !== -1) draft[index].name = channel.name;
      });
      state.value = updatedTodosArray;
    }
  },
});

export const { getAllChannels, addChannel, removeChannel, renameChannel } = counterSlice.actions;

export default counterSlice.reducer;

