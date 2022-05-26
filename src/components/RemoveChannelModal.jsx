import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { socket } from './App.jsx';

export default (props) => {
  const { show, handleClose, channel } = props;
  const allChannels = useSelector((state) => state.channels.value);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Remove channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={async() => {
          const { id } = allChannels.find((el) => el.name === channel);
          console.log(id);
          socket.emit('removeChannel', {id}, (response) => {
            console.log(response.status); // ok
          });
        }}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}