// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../assets/application.scss';

import React from 'react';
import { createRoot } from 'react-dom/client';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

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

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Login() {
  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={{
          name: '',
          pass: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="name" placeholder="name" />
            <ErrorMessage name="name" component="div" />
            <Field name="pass" placeholder="password" />
            <ErrorMessage name="pass" component="div" />
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function NotFound() {
  return <h2>404 (not found) указанной страницы нет</h2>;
}

const root = createRoot(document.getElementById('chat'));
root.render(<App />);
