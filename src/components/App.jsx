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
import { sendMessage } from '../slices/messagesSlice.js';
import LoginPage from './LoginPage.jsx';
import PrivatePage from './PrivatePage.jsx';
import AuthContext from '../contexts/index.jsx';
if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}
export const socket = io();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function App() {
  const dispatch = useDispatch();
  socket.on('newMessage', async (data) => {
      console.log('data', data);
      dispatch(sendMessage(data));
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

function NotFound() {
  return <h2>404 (not found) указанной страницы нет</h2>;
}
