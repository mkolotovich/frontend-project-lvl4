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
    .min(6, t('tooShort'))
    .required(t('required')),
  passConfirm: Yup.string()
    .min(6, t('tooShort'))
    .required(t('required')),
});

export default () => {
  const navigate = useNavigate();
  const [passError, setError] = useState(false);
  const [userError, setUserError] = useState(false);
  const error = passError || userError ? true : false;
  const { t } = useTranslation();
  const errorMessage = passError ? t('passText') : t('userText');
  const { logIn } = useAuth();
  return (
    <div>
      <h2>{t('registration')}</h2>
      <Formik
        initialValues={{
          name: '',
          pass: '',
          passConfirm: '',
        }}
        validationSchema={SignupSchema(t)}
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
              setError(false);
              console.log(sign.value);
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label>
              {t('name')}
              <Field name="name"/>
              <ErrorMessage name="name" component="div" />
            </label>
            <label>
              {t('password')}
              <Field name="pass"/>
              <ErrorMessage name="pass" component="div" />
            </label>
            <label>
              {t('passwordConfirm')}
              <Field name="passConfirm"/>
              <ErrorMessage name="passConfirm" component="div" />
            </label>
            {error && <div>{errorMessage}</div>}
            <button type="submit" disabled={isSubmitting}>{t('register')}</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
