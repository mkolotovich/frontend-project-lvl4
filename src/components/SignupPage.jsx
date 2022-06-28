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
    .min(6, 'tooShort')
    .required('required'),
});

export default function SignupPage() {
  const navigate = useNavigate();
  const [userError, setUserError] = useState(false);
  const errorClass = (isValid) => (isValid !== true || userError === true ? 'is-invalid form-control' : 'form-control');
  const { t } = useTranslation();
  const { logIn } = useAuth();
  return (
    <div className="container-fluid h-100">
      <div className="h-100 row align-content-center justify-content-center">
        <div className="col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="p-5 justify-content-around d-flex align-items-center">
              <div>
                <img className="rounded-circle" src="http://kolotovich-hexlet-messenger.surge.sh/images/avatar_1.jpg" alt={t('registration')} />
              </div>
              <Formik
                initialValues={{ name: '', pass: '', passConfirm: '' }}
                validate={(values) => {
                  const errors = {};
                  if (values.passConfirm.length > 0 && values.pass !== values.passConfirm) {
                    errors.passConfirm = 'passText';
                  }
                  return errors;
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values) => {
                  const { name, pass } = values;
                  const userData = { username: name, password: pass };
                  try {
                    const { data } = await axios.post(routes.signUpDataPath(), userData);
                    const { token, username } = data;
                    logIn(token, username);
                    navigate(routes.rootPath());
                  } catch (err) {
                    setUserError(!userError);
                  }
                }}
              >
                {({ isSubmitting, errors, isValid }) => (
                  <Form className="w-50">
                    <h1 className="text-center mb-4">{t('registration')}</h1>
                    <div className="form-floating mb-3">
                      <Field className={errorClass(isValid)} name="name" id="nick" placeholder={t('name')} />
                      <label htmlFor="nick">{t('name')}</label>
                      {!isValid && <div className="invalid-tooltip">{t(errors.name)}</div> }
                    </div>
                    <div className="form-floating mb-3">
                      <Field className={errorClass(isValid)} name="pass" id="password" placeholder={t('password')} type="password" />
                      <label htmlFor="password">{t('password')}</label>
                      {!isValid && <div className="invalid-tooltip">{t(errors.pass)}</div> }
                    </div>
                    <div className="form-floating mb-4">
                      <Field className={errorClass(isValid)} name="passConfirm" id="passwordConfirm" placeholder={t('passwordConfirm')} type="password" />
                      <label htmlFor="passwordConfirm">{t('passwordConfirm')}</label>
                      {!isValid && <div className="invalid-tooltip">{t(errors.passConfirm)}</div> }
                      {userError && <div className="invalid-tooltip">{t('userText')}</div>}
                    </div>
                    <button className="w-100 btn btn-outline-primary" type="submit" disabled={isSubmitting}>{t('register')}</button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
