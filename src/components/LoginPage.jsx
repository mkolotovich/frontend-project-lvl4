import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import useAuth from '../hooks/index.jsx';

const SignupSchema = (t) => Yup.object().shape({
  name: Yup.string()
    .min(3, t('lengthText'))
    .max(20, t('lengthText'))
    .required(t('required')),
  pass: Yup.string()
    .min(5, t('tooShort'))
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
            <label>
              {t('nick')}
              <Field name="name"/>
              <ErrorMessage name="name" component="div" />
            </label>
            <label>
              {t('password')}
              <Field name="pass"/>
              <ErrorMessage name="pass" component="div" />
            </label>
            {error && <div>{t('authorizationText')}</div>}
            <button type="submit" disabled={isSubmitting}>{t('logIn')}</button>
          </Form>
        )}
      </Formik>
      <a href='/signup'>{t('registration')}</a>
    </div>
  );
}

export default Login;