import React from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

export default function AuthButton() {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    auth.loggedIn
      ? (
        <Button onClick={() => {
          auth.logOut();
          navigate(routes.logInPath());
        }}
        >
          {t('logOut')}
        </Button>
      )
      : <Button as={Link} to={routes.logInPath()} state={{ from: location }}>{t('logIn')}</Button>
  );
}
