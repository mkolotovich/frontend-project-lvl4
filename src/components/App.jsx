import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../../assets/application.scss';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import { sendMessage } from '../slices/messagesSlice.js';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice.js';
import { removeChannelMessages } from '../slices/messagesSlice.js';
import { changeChannel } from '../slices/currentChanelSlice.js';
import LoginPage from './LoginPage.jsx';
import PrivatePage from './PrivatePage.jsx';
import NotFound from './NotFoundPage.jsx';
import SignupPage from './SignupPage.jsx';
import AuthButton from './AuthButton.jsx';
import AuthContext from '../contexts/index.jsx';
if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      ru: {
        translation: {
          "headerText": "Hexlet Chat",
          'logOut': 'Выйти',
          'logIn': 'Войти',
          'addChannel' : 'Добавить канал',
          'close': 'Отменить',
          'send' : 'Отправить',
          'duplicateText': 'Должно быть уникальным',
          'lengthText': 'От 3 до 20 символов',
          "nick": 'Ваш ник',
          "password" : 'Пароль',
          'authorizationText': 'Неверные имя пользователя или пароль',
          'registration' : 'Регистрация',
          'notFound' : 'Страница не найдена',
          'channels' : 'Каналы',
          'message' : 'Введите сообщение...',
          'remove' : 'Удалить',
          'rename' : 'Переименовать',
          'removeChannel' : 'Удалить канал',
          'sure' : 'Уверены?',
          'renameChannel' : 'Переименовать канал',
          'name' : 'Имя пользователя',
          'password' : 'Пароль',
          'passwordConfirm' : 'Подтвердите пароль',
          'register' : 'Зарегистрироваться',
          'required' : 'Обязательное поле',
          'tooShort' : 'Не менее 6 символов',
          'passText' : 'Пароли должны совпадать',
          'userText' : 'Такой пользователь уже существует',
          'channelAdded' : 'Канал создан',
          'channelRenamed' : 'Канал переименован',
          'channelRemoved' : 'Канал удалён'
        }
      }
    },
    lng: "ru",
    fallbackLng: "ru",

    interpolation: {
      escapeValue: false 
    }
  });

export const socket = io();

const AuthProvider = ({ children }) => {
  const value = localStorage.getItem('user') ? true : false;
  const [loggedIn, setLoggedIn] = useState(value);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function App() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const defaultChannelId = 1;
  socket.on('newMessage', async (data) => {
    console.log('data', data);
    dispatch(sendMessage(data));
  });
  socket.on('newChannel', async (data) => {
    console.log('data', data);
    const { id } = data;
    dispatch(addChannel(data));
    dispatch(changeChannel(id));
  });
  socket.on('removeChannel', async (data) => {
    console.log('data', data);
    dispatch(changeChannel(defaultChannelId));
    dispatch(removeChannel(data));
    dispatch(removeChannelMessages(data));
  });
  socket.on('renameChannel', async (data) => {
    console.log('data', data);
    dispatch(renameChannel(data));
  });
  return (
     <AuthProvider> 
      <Router>
        <div>
          <nav className='d-flex justify-content-between'>
            <ul>
              <li>
                <Link to="/">{t('headerText')}</Link>
              </li>
            </ul>
            <AuthButton />
          </nav>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivatePage />} />  
            <Route path="/signup" element={<SignupPage />} />  
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
