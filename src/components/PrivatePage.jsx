import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import useAuth from '../hooks/index.jsx';
import axios from 'axios';
import { getAllChannels } from '../slices/channelsSlice.js';
import { getAllMessages } from '../slices/messagesSlice.js';
import { socket } from './App.jsx';

const Home = () => {
  const allChannels = useSelector((state) => state.channels.value);
  const allMessages = useSelector((state) => state.messages.value);
  const currentChannelId = useSelector((state) => state.currentChannel.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();
  const { username } = auth;
  useEffect(() => {
    const request = async () => {
        const token = localStorage.getItem('userId');
        const { data: userData } = await axios.get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } });
        console.log(userData);
        const { channels, messages } = userData;
        console.log(channels);
        dispatch(getAllChannels(channels));
        console.log('allMessages', messages);
        dispatch(getAllMessages(messages));
        auth.logIn();
        console.log(username);
    };
    if (localStorage.getItem('userId')) {
      request();
    } else {
      navigate('/login');
    }
  }, []); 
  console.log(auth.loggedIn);
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
            {allMessages.map((message) => <div key={message.id}>{message.username}: {message.text}</div>)}
            <Formik
              initialValues={{
                message: '',
              }}
              onSubmit={async(values) => {
                console.log(values);
                socket.emit('newMessage', { text: values.message, channel: currentChannelId, username: auth.username }, (response) => {
                  console.log(response.status); // ok
                });
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

export default Home;