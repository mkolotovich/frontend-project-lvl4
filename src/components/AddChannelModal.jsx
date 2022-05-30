import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from 'react-toastify';
import { socket } from './App.jsx';

export default(props) => {
  const { show, handleClose } = props;
  const [inputValue, setValue] = useState('');
  const allChannels = useSelector((state) => state.channels.value);
  const [duplicateError, setError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const error = duplicateError || lengthError ? true : false;
  const { t } = useTranslation();
  const errorMessage = duplicateError ? t('duplicateText') : t('lengthText');
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannel')}</Modal.Title>
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
          {error && <div>{errorMessage}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('close')}
        </Button>
        <Button variant="primary" onClick={async() => {
          if (allChannels.some((el) => el.name === inputValue)) {
            setError(!duplicateError);
          } 
          else if (inputValue.length > 20) {
            setLengthError(!lengthError);
          }
          else {
            socket.emit('newChannel', { name: inputValue }, (response) => {
              console.log(response.status); // ok
            });
            toast(t('channelAdded'));
          }
        }}>
          {t('send')}
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}