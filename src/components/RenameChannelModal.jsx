import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { socket } from './App.jsx';

export default(props) => {
  const { show, handleClose, channel } = props;
  const [inputValue, setValue] = useState('');
  const allChannels = useSelector((state) => state.channels.value);
  const [error, setError] = useState(false);
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={async(e) => {
          const channelWithOutHash = channel.slice(2);
          const { id } = allChannels.find((el) => el.name === channelWithOutHash);
          console.log(id);
          if (allChannels.some((el) => el.name === inputValue)) {
            setError(!error);
          } else {
            socket.emit('renameChannel', { id, name: inputValue }, (response) => {
              console.log(response.status); // ok
            });
            toast(t('channelRenamed'));
          }
        }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className='visually-hidden'>Имя канала</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setValue(e.target.value)}
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('close')}
            </Button>
            <Button variant="primary" type='submit'>{t('send')}</Button>
          </Modal.Footer>
          {error && <div>{t('duplicateText')}</div>}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
