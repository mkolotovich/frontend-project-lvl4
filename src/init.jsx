import i18n from 'i18next';
import React from 'react';
import { initReactI18next } from 'react-i18next';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import ru from './locales/ru.js';
import { sendMessage, removeChannelMessages } from './slices/messagesSlice.js';
import {
  addChannel, removeChannel, renameChannel, changeChannel,
} from './slices/channelsSlice.js';
import App from './components/App.jsx';

export default function init() {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance
    .use(initReactI18next)
    .init({
      resources: {
        ru,
      },
      lng: 'ru',
      fallbackLng: 'ru',

      interpolation: {
        escapeValue: false,
      },
    });
  const socket = io();
  const defaultChannelId = 1;
  const dispatch = useDispatch();
  socket.on('newMessage', async (data) => {
    dispatch(sendMessage(data));
  });
  socket.on('newChannel', async (data) => {
    const { id } = data;
    dispatch(addChannel(data));
    dispatch(changeChannel(id));
  });
  socket.on('removeChannel', async (data) => {
    dispatch(changeChannel(defaultChannelId));
    dispatch(removeChannel(data));
    dispatch(removeChannelMessages(data));
  });
  socket.on('renameChannel', async (data) => {
    dispatch(renameChannel(data));
  });
  return <App socket={socket} />;
}
