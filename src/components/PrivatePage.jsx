import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import useAuth from '../hooks/index.jsx';
import { getAllChannels, changeChannel } from '../slices/channelsSlice.js';
import { getAllMessages } from '../slices/messagesSlice.js';
import AddChannelModal from './AddChannelModal.jsx';
import RemoveChannelModal from './RemoveChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';

const channelSwitchHandler = (e, allChannels, dispatch) => {
  const { currentTarget } = e;
  const currentChannelName = currentTarget.textContent;
  const channelWithOutHash = currentChannelName.slice(2);
  const currentChannel = allChannels.find((el) => el.name === channelWithOutHash);
  const currentChannelId = currentChannel.id;
  dispatch(changeChannel(currentChannelId));
};

function Home() {
  const allChannels = useSelector((state) => state.channels.channels);
  const allMessages = useSelector((state) => state.messages.value);
  const currentChannelId = useSelector((state) => state.channels.currentChannel);
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
    setChannel(target.textContent);
    setShowRemove(true);
  };
  const handleShowRename = (e) => {
    e.preventDefault();
    const eventTarget = e.target;
    const parent = eventTarget.closest('.d-flex');
    const target = parent.querySelector('button');
    setChannel(target.textContent);
    setShowRename(true);
  };
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const request = async () => {
      const token = user.userId;
      const { data: userData } = await axios.get('/api/v1/data', { headers: { Authorization: `Bearer ${token}` } });
      const { channels, messages } = userData;
      dispatch(getAllChannels(channels));
      dispatch(getAllMessages(messages));
      auth.logIn();
    };
    if (localStorage.getItem('user')) {
      try {
        request();
      } catch (err) {
        toast(t('networkError'));
      }
    } else {
      navigate('/login');
    }
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div>
            {t('channels')}
            <button onClick={handleShow} type="button">+</button>
          </div>
          <ul>
            {allChannels.map((channel) => (
              <li className="d-flex" key={channel.id}>
                <button
                  type="button"
                  onClick={(e) => channelSwitchHandler(e, allChannels, dispatch, allMessages)}
                >
                  <span># </span>
                  {channel.name}
                </button>
                {channel.removable && (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <span className="visually-hidden">Управление каналом</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1" onClick={(e) => handleShowRemove(e)}>{t('remove')}</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={(e) => handleShowRename(e)}>{t('rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col">
          <div><b>{allChannels.length > 0 && `# ${allChannels.find((el) => el.id === currentChannelId).name}`}</b></div>
          <div>
            {allChannelMessages.map((message) => (
              <div className="text-break" key={message.id}>
                {message.username}
                :
                {' '}
                {message.text}
              </div>
            ))}
            <Formik
              initialValues={{
                message: '',
              }}
              onSubmit={async () => {
                if (inputValue !== '') {
                  auth.socket.emit('newMessage', { text: filter.clean(inputValue), channelId: currentChannelId, username: user.user }, (response) => {
                    if (response.status !== 'ok') {
                      toast(t('networkError'));
                    }
                  });
                  setValue('');
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="message" placeholder={t('message')} onChange={(e) => setValue(e.target.value)} value={inputValue} aria-label="Новое сообщение" />
                  <ErrorMessage name="message" component="div" />
                  <button type="submit" disabled={isSubmitting}>{'->'}</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <AddChannelModal show={show} handleClose={handleClose} />
      <RemoveChannelModal show={showRemove} handle={handleCloseRemove} channel={channelRemove} />
      <RenameChannelModal show={showRename} handle={handleCloseRename} channel={channelRemove} />
    </div>
  );
}

export default Home;
