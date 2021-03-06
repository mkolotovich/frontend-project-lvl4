import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import useAuth from '../hooks/index.jsx';
import { getAllChannels } from '../slices/channelsSlice.js';
import { getAllMessages } from '../slices/messagesSlice.js';
import { handleShow, channelSwitchHandler, Modals } from './modals/Modals.jsx';
import routes from '../routes.js';

function Home() {
  const allChannels = useSelector((state) => state.channels.channels);
  const allMessages = useSelector((state) => state.messages.messages);
  const currentChannelId = useSelector((state) => state.channels.currentChannel);
  const activeChannelClass = (id) => (currentChannelId === id ? 'btn-secondary btn text-start w-100 text-truncate rounded-0' : 'btn text-start w-100 text-truncate rounded-0');
  const allChannelMessages = allMessages.filter((el) => el.channelId === currentChannelId);
  const dispatch = useDispatch();
  const auth = useAuth();
  const [inputValue, setValue] = useState('');
  const { t } = useTranslation();
  const messagesWrapper = useRef(null);
  useEffect(() => {
    const request = async () => {
      const token = auth.user.userId;
      const { data: userData } = await axios.get(routes.dataPath(), { headers: { Authorization: `Bearer ${token}` } });
      const { channels, messages } = userData;
      dispatch(getAllChannels(channels));
      dispatch(getAllMessages(messages));
    };
    try {
      request();
    } catch (err) {
      toast(t('networkError'));
    }
  }, []);
  useEffect(() => {
    messagesWrapper.current.scrollBy(0, window.innerHeight);
  });
  return (
    <div className="container my-4 overflow-hidden h-100 shadow rounded">
      <div className="row h-100 bg-white">
        <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
            {t('channels')}
            <button className="btn btn-group-vertical p-0 text-primary" onClick={(evt) => handleShow(dispatch, evt, 'add')} type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul className="px-2">
            {allChannels.map((channel) => (
              <li className="w-100" key={channel.id}>
                {!channel.removable && (
                <button
                  className={activeChannelClass(channel.id)}
                  type="button"
                  onClick={() => channelSwitchHandler(channel.id, allChannels, dispatch)}
                >
                  <span># </span>
                  {channel.name}
                </button>
                )}
                {channel.removable && (
                <Dropdown as={ButtonGroup} className="d-flex">
                  <button className={activeChannelClass(channel.id)} type="button" onClick={() => channelSwitchHandler(channel.id, allChannels, dispatch)}>
                    <span># </span>
                    {channel.name}
                  </button>
                  <Dropdown.Toggle split variant="secondary" id={channel.id}>
                    <span className="visually-hidden">{t('channelManagment')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#" onClick={(evt) => handleShow(dispatch, evt, 'remove', channel)}>{t('remove')}</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(evt) => handleShow(dispatch, evt, 'rename', channel)}>{t('rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col h-100 p-0">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small"><b>{allChannels.length > 0 && `# ${allChannels.find((el) => el.id === currentChannelId).name}`}</b></div>
            <div className="px-5 overflow-auto" ref={messagesWrapper}>
              {allChannelMessages.map((message) => (
                <div className="text-break mb-2" key={message.id}>
                  <b>{message.username}</b>
                  :
                  {' '}
                  {message.text}
                </div>
              ))}
            </div>
            <Formik
              initialValues={{ message: '' }}
              onSubmit={async () => {
                if (inputValue !== '') {
                  auth.socket.emit('newMessage', { text: filter.clean(inputValue), channelId: currentChannelId, username: auth.user.user }, (response) => {
                    if (response.status !== 'ok') {
                      toast(t('networkError'));
                    }
                  });
                  setValue('');
                }
              }}
            >
              {({ isSubmitting }) => (
                <div className="mt-auto px-5 py-3">
                  <Form className="py-1 border rounded-2">
                    <div className="input-group">
                      <Field className="form-control border-0 p-0 ps-2" name="message" placeholder={t('message')} onChange={(e) => setValue(e.target.value)} value={inputValue} aria-label={t('newMessage')} />
                      <button className="btn btn-group-vertical" type="submit" disabled={isSubmitting}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-square" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                        </svg>
                      </button>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <Modals />
    </div>
  );
}

export default Home;
