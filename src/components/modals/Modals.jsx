import React from 'react';
import { useDispatch } from 'react-redux';
import { changeChannel } from '../../slices/channelsSlice.js';
import { setModalHide, setModalActive } from '../../slices/modalsSlice.js';
import AddChannelModal from './AddChannelModal.jsx';
import RemoveChannelModal from './RemoveChannelModal.jsx';
import RenameChannelModal from './RenameChannelModal.jsx';

export const channelSwitchHandler = (id, allChannels, dispatch) => {
  const currentChannel = allChannels.find((el) => el.id === id);
  const currentChannelId = currentChannel.id;
  dispatch(changeChannel(currentChannelId));
};

export const handleShow = (dispatch, evt, type, channel) => {
  const clojure = () => {
    evt.preventDefault();
    dispatch(setModalActive({ type, channel }));
  };
  return clojure();
};

export function Modals() {
  const dispatch = useDispatch();
  const handleClose = (type) => () => dispatch(setModalHide(type));
  return (
    <>
      <AddChannelModal modal="add" handle={handleClose} />
      <RemoveChannelModal modal="remove" handle={handleClose} />
      <RenameChannelModal modal="rename" handle={handleClose} />
    </>
  );
}
