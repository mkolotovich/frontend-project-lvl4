import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

const initialState = {
  modals: { isShow: false, type: null, channel: null },
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalActive: (state, action) => {
      const newState = state;
      const { type, channel } = action.payload;
      const updatedModals = produce(state.modals, (draft) => {
        const newDraft = draft;
        newDraft.isShow = true;
        newDraft.channel = channel;
        newDraft.type = type;
      });
      newState.modals = updatedModals;
    },
    setModalHide: (state) => {
      const newState = state;
      const updatedModals = produce(state.modals, (draft) => {
        const newDraft = draft;
        newDraft.isShow = false;
      });
      newState.modals = updatedModals;
    },
  },
});

export const { setModalHide, setModalActive } = modalsSlice.actions;

export default modalsSlice.reducer;
