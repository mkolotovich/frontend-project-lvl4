import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

const initialState = {
  channels: [],
  currentChannel: 1,
};

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    getAllChannels: (state, action) => {
      const newState = state;
      newState.channels = action.payload;
    },
    changeChannel: (state, action) => {
      const newState = state;
      newState.currentChannel = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    removeChannel: (state, action) => {
      const newState = state;
      const { id } = action.payload;
      const filteredChannels = state.channels.filter((el) => el.id !== id);
      newState.channels = filteredChannels;
    },
    renameChannel: (state, action) => {
      const newState = state;
      const channel = action.payload;
      const updatedChannelArray = produce(state.channels, (draft) => {
        const newDraft = draft;
        const index = draft.findIndex((todo) => todo.id === channel.id);
        if (index !== -1) newDraft[index].name = channel.name;
      });
      newState.channels = updatedChannelArray;
    },
  },
});

export const {
  getAllChannels, addChannel, removeChannel, renameChannel, changeChannel,
} = channelSlice.actions;

export default channelSlice.reducer;
