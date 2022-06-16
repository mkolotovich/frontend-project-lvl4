import React, { useState } from 'react';
import { changeChannel } from '../slices/channelsSlice.js';
import Home from './PrivatePage.jsx';

const channelSwitchHandler = (id, allChannels, dispatch) => {
  const currentChannel = allChannels.find((el) => el.id === id);
  const currentChannelId = currentChannel.id;
  dispatch(changeChannel(currentChannelId));
};

export default function Modals() {
  const [channelId, setChannelId] = useState('');
  const [show, setShow] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseRemove = () => setShowRemove(false);
  const handleCloseRename = () => setShowRename(false);
  const handleShowRemove = (e, id, allChannels) => {
    e.preventDefault();
    const channel = allChannels.find((el) => el.id === id);
    setChannelId(channel.id);
    setShowRemove(true);
  };
  const handleShowRename = (e, id, allChannels) => {
    e.preventDefault();
    const channel = allChannels.find((el) => el.id === id);
    setChannelId(channel.id);
    setShowRename(true);
  };
  const params = {
    channelId,
    show,
    showRemove,
    showRename,
    handleClose,
    handleCloseRemove,
    handleCloseRename,
    handleShow,
    handleShowRemove,
    handleShowRename,
    channelSwitchHandler,
  };
  return <Home params={params} />;
}
