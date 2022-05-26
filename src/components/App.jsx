import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../../assets/application.scss';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { normalize, schema } from 'normalizr';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { sendMessage } from '../slices/messagesSlice.js';
import { addChannel, removeChannel, renameChannel } from '../slices/channelsSlice.js';
import { removeChannelMessages } from '../slices/messagesSlice.js';
import { changeChannel } from '../slices/currentChanelSlice.js';
import useAuth from '../hooks/index.jsx';
import LoginPage from './LoginPage.jsx';
import PrivatePage from './PrivatePage.jsx';
import NotFound from './NotFoundPage.jsx';
import AuthContext from '../contexts/index.jsx';
if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}
export const socket = io();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function App() {
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
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivatePage />} />  
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
