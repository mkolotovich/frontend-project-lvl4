import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { socket } from './App.jsx';

export default(props) => {
  const { show, handleClose, channel } = props;
  const [inputValue, setValue] = useState('');
  const allChannels = useSelector((state) => state.channels.value);
  const [error, setError] = useState(false);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rename channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className='visually-hidden'>Channel name</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setValue(e.target.value)}
            />
          </Form.Group>
          {error && <div>Channel must be unique!</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={async() => {
          const { id } = allChannels.find((el) => el.name === channel);
          console.log(id);
          if (allChannels.some((el) => el.name === inputValue)) {
            setError(!error);
          } else {
            socket.emit('renameChannel', { id, name: inputValue }, (response) => {
              console.log(response.status); // ok
            });
          }
        }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
