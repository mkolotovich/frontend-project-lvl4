import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import useAuth from '../hooks/index.jsx';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import filter from 'leo-profanity';
import { getAllChannels } from '../slices/channelsSlice.js';
import { getAllMessages } from '../slices/messagesSlice.js';
import { changeChannel } from '../slices/currentChanelSlice.js';
import AddChannelModal from './AddChannelModal.jsx';
import RemoveChannelModal from './RemoveChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';
import { socket } from './App.jsx';

const channelSwitchHandler = (e, allChannels, dispatch, allMessages) => {
  const target = e.target;
  const currentChannelName = target.textContent;
  const channelWithOutHash = currentChannelName.slice(2);
  const currentChannel = allChannels.find((el) => el.name === channelWithOutHash);
  const currentChannelId = currentChannel.id;
  console.log(currentChannelId);
  dispatch(changeChannel(currentChannelId));
  const channeltMessages = allMessages.filter((el) => el.channel === currentChannelId);
  console.log(channeltMessages);
};

const Home = () => {
  const allChannels = useSelector((state) => state.channels.value);
  const allMessages = useSelector((state) => state.messages.value);
  const currentChannelId = useSelector((state) => state.currentChannel.value);
  const allChannelMessages = allMessages.filter((el) => el.channelId === currentChannelId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showRemove, setShowRemove] = useState(false);
  const handleCloseRemove = () => setShowRemove(false);
  const [channelRemove, setChannel] = useState('');
  const [showRename, setShowRename] = useState(false);
  const handleCloseRename = () => setShowRename(false);
  const [inputValue, setValue] = useState('');
  const { t } = useTranslation();
  const handleShowRemove = (e) => {
    e.preventDefault();
    const eventTarget = e.target;
    const parent = eventTarget.closest('.d-flex');
    const target = parent.querySelector('button');
    console.log(target.textContent);
    setChannel(target.textContent);
    console.log(channelRemove);
    setShowRemove(true);
  };
  const handleShowRename = (e) => {
    e.preventDefault();
    const eventTarget = e.target;
    const parent = eventTarget.closest('.d-flex');
    const target = parent.querySelector('button');
    console.log(target.textContent);
    setChannel(target.textContent);
    console.log(channelRemove);
    setShowRename(true);
  };
  useEffect(() => {
    const request = async () => {
      const token = user.userId;
      console.log(token);
      const { data: userData } = await axios.get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } });
      console.log(userData);
      const { channels, messages } = userData;
      console.log(channels);
      dispatch(getAllChannels(channels));
      console.log('allMessages', messages);
      dispatch(getAllMessages(messages));
      const channeltMessages = messages.filter((el) => el.channel === currentChannelId);
      console.log(channeltMessages);
      auth.logIn();
    };
    if (localStorage.getItem('user')) {
      try {
        request();
      } catch(err) {
        toast(t('networkError'))
      }
    } else {
      navigate('/login');
    }
  }, []);
  const user = JSON.parse(localStorage.getItem('user'));
  const channel = allChannels.length > 0 ? allChannels.find((el) => el.id === currentChannelId) : {};
  const channelWithHash = `# ${channel.name}`;
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div>{t('channels')}
            <button onClick = {handleShow}>+</button>
          </div>
          <ul>
            {allChannels.map((channel) => 
              <li className='d-flex' key={channel.id}>
                <button onClick = {(e) => channelSwitchHandler(e, allChannels, dispatch, allMessages)}>
                  <span className='me-1'>#</span>{channel.name}
                </button>
                {channel.removable && <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic"></Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1" onClick = {(e) => handleShowRemove(e)}>{t('remove')}</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick = {(e) => handleShowRename(e)}>{t('rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>}
              </li>)
            }
          </ul>
        </div>
        <div className="col">
          <div><b>{channelWithHash}</b></div>
          <div>
            {allChannelMessages.map((message) => <div className='text-break' key={message.id}>{message.username}: {message.text}</div>)}
            <Formik
              initialValues={{
                message: '',
              }}
              onSubmit={async(values) => {
                console.log(values);
                if (inputValue !== '') {
                  socket.emit('newMessage', { text: filter.clean(inputValue), channelId: currentChannelId, username: user.user }, (response) => {
                    console.log(response.status); // ok
                  });
                  setValue('');
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="message" placeholder={t('message')} onChange={(e) => setValue(e.target.value)} value={inputValue} aria-label="Новое сообщение"/>
                  <ErrorMessage name="message" component="div" />
                  <button type="submit" disabled={isSubmitting}>{'->'}</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <AddChannelModal show={show} handleClose={handleClose}/>
      <RemoveChannelModal show={showRemove} handleClose={handleCloseRemove} channel={channelRemove}/>
      <RenameChannelModal show={showRename} handleClose={handleCloseRename} channel={channelRemove}/>
      <ToastContainer />
    </div>
  );
}

export default Home;