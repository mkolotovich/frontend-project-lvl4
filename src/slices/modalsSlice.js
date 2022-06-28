import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

const initialState = {
  modals: [
    { show: false, type: 'add' }, { show: false, type: 'remove', channel: null }, { show: false, type: 'rename', channel: null },
  ],
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalActive: (state, action) => {
      const newState = state;
      const { type, channel } = action.payload;
      const updatedModalsArray = produce(state.modals, (draft) => {
        const newDraft = draft;
        const index = draft.findIndex((modal) => modal.type === type);
        if (index !== -1) {
          newDraft[index].show = true;
          newDraft[index].channel = channel;
        }
      });
      newState.modals = updatedModalsArray;
    },
    setModalHide: (state, action) => {
      const newState = state;
      const type = action.payload;
      const updatedModalsArray = produce(state.modals, (draft) => {
        const newDraft = draft;
        const index = draft.findIndex((modal) => modal.type === type);
        if (index !== -1) newDraft[index].show = false;
      });
      newState.modals = updatedModalsArray;
    },
  },
});

export const { setModalHide, setModalActive } = modalsSlice.actions;

export default modalsSlice.reducer;
