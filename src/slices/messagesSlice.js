// import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
// import routes from '../routes.js';

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

// export const sendNewMessage = (channelId, payload) => async (dispatch) => {
//   dispatch(sendMessage());
//   const url = routes.channelMessagesPath(channelId);
//   const data = { data: { attributes: payload } };

//   try {
//     await axios.post(url, data);
//     console.log('Message sent');
//     // dispatch(sendNewMessageSuccess());
//     return true;
//   } catch (error) {
//     console.log(error);
//     // dispatch(sendNewMessageFailure());
//     return false;
//   }
// };

export default counterSlice.reducer;
