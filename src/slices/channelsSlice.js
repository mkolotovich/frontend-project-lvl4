import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

const initialState = {
  channels: [],
  currentChannel: 1,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    getAllChannels: (state, action) => {
      state.channels = action.payload;
    },
    changeChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;
      const filteredChannels = state.channels.filter((el) => el.id !== id);
      state.channels = filteredChannels;
    },
    renameChannel: (state, action) => {
      const channel = action.payload;
      const updatedTodosArray = produce(state.channels , draft => {
        const index = draft.findIndex(todo => todo.id === channel.id)
        if (index !== -1) draft[index].name = channel.name;
      });
      state.channels = updatedTodosArray;
    }
  },
});

export const { getAllChannels, addChannel, removeChannel, renameChannel, changeChannel } = counterSlice.actions;

export default counterSlice.reducer;

