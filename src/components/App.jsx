import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../../assets/application.scss';
import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import { ErrorBoundary, Provider } from '@rollbar/react';
import { sendMessage, removeChannelMessages } from '../slices/messagesSlice.js';
import {
  addChannel, removeChannel, renameChannel, changeChannel,
} from '../slices/channelsSlice.js';
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
          headerText: 'Hexlet Chat',
          logOut: 'Выйти',
          logIn: 'Войти',
          addChannel: 'Добавить канал',
          close: 'Отменить',
          send: 'Отправить',
          duplicateText: 'Должно быть уникальным',
          lengthText: 'От 3 до 20 символов',
          nick: 'Ваш ник',
          password: 'Пароль',
          authorizationText: 'Неверные имя пользователя или пароль',
          registration: 'Регистрация',
          notFound: 'Страница не найдена',
          channels: 'Каналы',
          message: 'Введите сообщение...',
          remove: 'Удалить',
          rename: 'Переименовать',
          removeChannel: 'Удалить канал',
          sure: 'Уверены?',
          renameChannel: 'Переименовать канал',
          name: 'Имя пользователя',
          passwordConfirm: 'Подтвердите пароль',
          register: 'Зарегистрироваться',
          required: 'Обязательное поле',
          tooShort: 'Не менее 6 символов',
          passText: 'Пароли должны совпадать',
          userText: 'Такой пользователь уже существует',
          channelAdded: 'Канал создан',
          channelRenamed: 'Канал переименован',
          channelRemoved: 'Канал удалён',
          networkError: 'Ошибка соединения',
        },
      },
    },
    lng: 'ru',
    fallbackLng: 'ru',

    interpolation: {
      escapeValue: false,
    },
  });

const rollbarConfig = {
  accessToken: '35e495b1164e48aab3f3ebdd9fd1dfd3',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

function AuthProvider({ children, socket }) {
  const value = !!localStorage.getItem('user');
  const [loggedIn, setLoggedIn] = useState(value);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, socket,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function App() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const defaultChannelId = 1;
  const socket = io();
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
  return (
    // <AuthProvider>
    <AuthProvider socket={socket}>
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          <Router>
            <div>
              <nav className="d-flex justify-content-between">
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
        </ErrorBoundary>
      </Provider>
      <ToastContainer />
    </AuthProvider>
  );
}
