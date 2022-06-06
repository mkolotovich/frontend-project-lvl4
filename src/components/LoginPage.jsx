import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';

const SignupSchema = (t) => Yup.object().shape({
  name: Yup.string()
    .min(3, t('lengthText'))
    .max(20, t('lengthText'))
    .required(t('required')),
  pass: Yup.string()
    .required(t('required')),
});

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { logIn } = useAuth();
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('logIn')}</h2>
      <Formik
        initialValues={{
          name: '',
          pass: '',
        }}
        validationSchema={SignupSchema(t)}
        onSubmit={async (values) => {
          const { name, pass } = values;
          try {
            const { data } = await axios.post('/api/v1/login', { username: name, password: pass });
            const { token, username } = data;
            logIn();
            const user = { userId: token, user: username };
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
          } catch (err) {
            setError(!error);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="nick">
              {t('nick')}
              <Field name="name" id="nick" />
              <ErrorMessage name="name" component="div" />
            </label>
            <label htmlFor="password">
              {t('password')}
              <Field name="pass" id="password" />
              <ErrorMessage name="pass" component="div" />
            </label>
            {error && <div>{t('authorizationText')}</div>}
            <button type="submit" disabled={isSubmitting}>{t('logIn')}</button>
          </Form>
        )}
      </Formik>
      <a href="/signup">{t('registration')}</a>
    </div>
  );
}

export default Login;
