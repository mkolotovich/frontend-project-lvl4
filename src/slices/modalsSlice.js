import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';

const initialState = {
  modals: [
    { id: 0, show: false }, { id: 1, show: false }, { id: 2, show: false },
  ],
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalActive: (state, action) => {
      const newState = state;
      const id = action.payload;
      const updatedModalsArray = produce(state.modals, (draft) => {
        const newDraft = draft;
        const index = draft.findIndex((todo) => todo.id === id);
        if (index !== -1) newDraft[index].show = true;
      });
      newState.modals = updatedModalsArray;
    },
    setModalHide: (state, action) => {
      const newState = state;
      const id = action.payload;
      const updatedModalsArray = produce(state.modals, (draft) => {
        const newDraft = draft;
        const index = draft.findIndex((todo) => todo.id === id);
        if (index !== -1) newDraft[index].show = false;
      });
      newState.modals = updatedModalsArray;
    },
  },
});

export const { setModalHide, setModalActive } = modalsSlice.actions;

export default modalsSlice.reducer;
