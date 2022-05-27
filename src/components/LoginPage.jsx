import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/index.jsx';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  pass: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});
  
function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { logIn } = useAuth();
  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={{
          name: '',
          pass: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          console.log(values);
          const { name, pass } = values;
          try {
            const { data } = await axios.post('/api/v1/login', { username: name, password: pass });
            console.log(data);
            const { token, username } = data;
            logIn();
            console.log(username);
            const user = {userId: token, user: username};
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
          } catch (err) {
            console.log(err);
            setError(!error);
            console.log(sign.value);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="name" placeholder="name" />
            <ErrorMessage name="name" component="div" />
            <Field name="pass" placeholder="password" />
            <ErrorMessage name="pass" component="div" />
            {error && <div>Authorization Error!</div>}
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
      <a href='/signup'>Registration</a>
    </div>
  );
}

export default Login;