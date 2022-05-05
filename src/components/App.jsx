import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';

import '../../assets/application.scss';

import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

import axios from 'axios';

import { getAllChannels } from '../slices/channelsSlice.js';
import { getAllMessages } from '../slices/messagesSlice.js';

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

const signed = [{ name: 'signError', value: false }, { name: 'signError', value: true }];

const UserContext = React.createContext({
  signed: [],
  sign: {},
  setSign: () => {},
});

export default function App() {
  const [sign, setSign] = useState(signed[0]);
  return (
    <UserContext.Provider value={{ sign, setSign: (name) => setSign({ name }), signed }}>
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
    </UserContext.Provider>
  );
}

function Home() {
  const allChannels = useSelector((state) => state.channels.value);
  const allMessages = useSelector((state) => state.messages.value);
  console.log('allChannels', allChannels);
  console.log(allMessages);
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div>Chanells</div>
          <ul>
            {allChannels.map((channel) => <li key={channel.id}>{channel.name}</li>)}
          </ul>
        </div>
        <div className="col">
          <div>Messages</div>
          <div>
            {allMessages.map((message) => <div key={message.id}>{message.text}</div>)}
            <Formik
              initialValues={{
                message: '',
              }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="message" placeholder="message" />
                  <ErrorMessage name="message" component="div" />
                  <button type="submit" disabled={isSubmitting}>Submit</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const { sign } = useContext(UserContext);
  console.log(sign);
  const dispatch = useDispatch();
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
            localStorage.setItem(username, token);
            navigate('/');
            if (!localStorage.getItem(username)) {
              navigate('/login');
            }
            const { data: userData } = await axios.get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } });
            console.log(userData);
            const { channels, messages } = userData;
            console.log(channels);
            dispatch(getAllChannels(channels));
            dispatch(getAllMessages(messages));
          } catch (err) {
            console.log(err);
            sign.value = !sign.value;
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
            {sign.value && <div>Authorization Error!</div>}
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
