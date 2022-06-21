import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Formik, Form, Field,
} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const SignupSchema = () => Yup.object().shape({
  name: Yup.string()
    .min(3, 'lengthText')
    .max(20, 'lengthText')
    .required('required'),
  pass: Yup.string()
    .required('required'),
});

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { logIn } = useAuth();
  const errorClass = error === true ? 'is-invalid form-control' : 'form-control';
  const { t } = useTranslation();
  return (
    <div className="container-fluid h-100">
      <div className="h-100 row align-content-center justify-content-center">
        <div className="col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="p-5 row">
              <div className="col-md-6 d-flex d-flex justify-content-center align-items-center">
                <img className="rounded-circle" src="http://kolotovich-hexlet-messenger.surge.sh/images/avatar_3.jpg" alt={t('logIn')} />
              </div>
              <Formik
                initialValues={{
                  name: '',
                  pass: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values) => {
                  const { name, pass } = values;
                  const userData = { username: name, password: pass };
                  try {
                    const { data } = await axios.post(routes.loginDataPath(), userData);
                    const { token, username } = data;
                    logIn(token, username);
                    navigate(routes.rootPath());
                  } catch (err) {
                    setError(!error);
                  }
                }}
              >
                {({ isSubmitting, errors, isValid }) => (
                  <Form className="col-md-6 mt-3">
                    <h1 className="text-center mb-4">{t('logIn')}</h1>
                    <div className="form-floating mb-3">
                      <Field className={errorClass} name="name" id="nick" placeholder={t('nick')} />
                      <label htmlFor="nick">{t('nick')}</label>
                      {!isValid && <div>{t(errors.name)}</div> }
                    </div>
                    <div className="form-floating mb-4">
                      <Field className={errorClass} name="pass" id="password" placeholder={t('password')} type="password" />
                      <label htmlFor="password">{t('password')}</label>
                      {!isValid && <div>{t(errors.pass)}</div> }
                      {error && <div className="invalid-tooltip">{t('authorizationText')}</div>}
                    </div>
                    <button className="btn w-100 mb-3 btn-outline-primary" type="submit" disabled={isSubmitting}>{t('logIn')}</button>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('noAccount')}</span>
                {' '}
                <a href="/signup">{t('registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
