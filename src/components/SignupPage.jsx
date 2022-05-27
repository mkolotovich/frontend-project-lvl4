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
    .min(3, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),  
  pass: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  passConfirm: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

export default () => {
  const navigate = useNavigate();
  const [passError, setError] = useState(false);
  const [userError, setUserError] = useState(false);
  const error = passError || userError ? true : false;
  const errorMessage = passError ? 'Pass and passConfirm must be equal!' : 'This user is already exists!';
  const { logIn } = useAuth();
  return (
    <div>
      <h2>Signup</h2>
      <Formik
        initialValues={{
          name: '',
          pass: '',
          passConfirm: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          console.log(values);
          const { name, pass, passConfirm } = values;
          if (pass !== passConfirm) {
            setError(!passError);
          } else {
            try {
              const { data } = await axios.post('/api/v1/signup', { username: name, password: pass });
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
              setUserError(!userError);
              setError(!passError);
              console.log(sign.value);
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="name" placeholder="name" />
            <ErrorMessage name="name" component="div" />
            <Field name="pass" placeholder="password"/>
            <ErrorMessage name="pass" component="div" />
            <Field name="passConfirm" placeholder="password confirmation"/>
            <ErrorMessage name="passConfirm" component="div" />
            {error && <div>{errorMessage}</div>}
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
