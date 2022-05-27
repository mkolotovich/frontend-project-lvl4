import React from 'react';
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import useAuth from '../hooks/index.jsx';

export default () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    auth.loggedIn
      ? <Button onClick={() => {
        auth.logOut();
        navigate('/login');
      }}>Log out</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>Log in</Button>
  );
};