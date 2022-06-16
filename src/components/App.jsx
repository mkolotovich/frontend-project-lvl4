import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../../assets/application.scss';
import { ToastContainer } from 'react-toastify';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary, Provider } from '@rollbar/react';
import LoginPage from './LoginPage.jsx';
import NotFound from './NotFoundPage.jsx';
import SignupPage from './SignupPage.jsx';
import AuthButton from './AuthButton.jsx';
import AuthContext from '../contexts/index.jsx';
import Modals from './Modals.jsx';
import routes from '../routes.js';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const rollbarConfig = {
  accessToken: process.env.accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: 'production',
  },
};

function AuthProvider({ children, socket }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const getUser = () => setUser(JSON.parse(localStorage.getItem('user')));
  const value = !!localStorage.getItem('user');
  const [loggedIn, setLoggedIn] = useState(value);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{
      loggedIn, logIn, logOut, socket, user, getUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function App(props) {
  const { t } = useTranslation();
  const { socket } = props;
  return (
    <AuthProvider socket={socket}>
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          <Router>
            <div className="h-100 d-flex flex-column">
              <nav className="d-flex justify-content-between bg-white navbar shadow-sm navbar-light">
                <div className="container">
                  <Link className="navbar-brand" to={routes.rootPath()}>{t('headerText')}</Link>
                  <AuthButton />
                </div>
              </nav>
              <Routes>
                <Route path={routes.logInPath()} element={<LoginPage />} />
                <Route path={routes.rootPath()} element={<Modals />} />
                <Route path={routes.signUpPath()} element={<SignupPage />} />
                <Route path={routes.notFoundPath()} element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </ErrorBoundary>
      </Provider>
      <ToastContainer />
    </AuthProvider>
  );
}
