import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeChannel } from '../slices/channelsSlice.js';
import Home from './PrivatePage.jsx';
import { setModalHide, setModalActive } from '../slices/modalsSlice.js';

const channelSwitchHandler = (id, allChannels, dispatch) => {
  const currentChannel = allChannels.find((el) => el.id === id);
  const currentChannelId = currentChannel.id;
  dispatch(changeChannel(currentChannelId));
};

export default function Modals() {
  const [channelId, setChannelId] = useState('');
  const [channelName, setChannelName] = useState('');
  const dispatch = useDispatch();
  const handleClose = (id) => {
    const clojure = () => dispatch(setModalHide(id));
    return clojure;
  };
  const handleShow = (evt, modalId, id, allChannels) => {
    const clojure = () => {
      evt.preventDefault();
      if (modalId !== 0) {
        const channel = allChannels.find((el) => el.id === id);
        setChannelId(channel.id);
        setChannelName(channel.name);
      }
      dispatch(setModalActive(modalId));
    };
    return clojure();
  };
  const params = {
    channelSwitchHandler, handleClose, handleShow, channelId, channelName,
  };
  return <Home params={params} />;
}
