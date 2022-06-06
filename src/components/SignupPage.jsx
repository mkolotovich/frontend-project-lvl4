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
    .min(6, t('tooShort'))
    .required(t('required')),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [userError, setUserError] = useState(false);
  const { t } = useTranslation();
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
        validate={(values) => {
          const errors = {};
          if (values.passConfirm.length > 0 && values.pass !== values.passConfirm) {
            errors.passConfirm = t('passText');
          }
          return errors;
        }}
        validationSchema={SignupSchema(t)}
        onSubmit={async (values) => {
          const { name, pass } = values;
          try {
            const { data } = await axios.post('/api/v1/signup', { username: name, password: pass });
            const { token, username } = data;
            logIn();
            const user = { userId: token, user: username };
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
          } catch (err) {
            setUserError(!userError);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="nick">
              {t('name')}
              <Field name="name" id="nick" />
              <ErrorMessage name="name" component="div" />
            </label>
            <label htmlFor="password">
              {t('password')}
              <Field name="pass" id="password" />
              <ErrorMessage name="pass" component="div" />
            </label>
            <label htmlFor="passwordConfirm">
              {t('passwordConfirm')}
              <Field name="passConfirm" id="passwordConfirm" />
              <ErrorMessage name="passConfirm" component="div" />
            </label>
            {userError && <div>{t('userText')}</div>}
            <button type="submit" disabled={isSubmitting}>{t('register')}</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
