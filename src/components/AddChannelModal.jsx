import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';

export default function AddChannelModal(props) {
  const { show, handleClose } = props;
  const auth = useAuth();
  const [inputValue, setValue] = useState('');
  const allChannels = useSelector((state) => state.channels.channels);
  const [duplicateError, setError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const error = !!(duplicateError || lengthError);
  const { t } = useTranslation();
  const errorMessage = duplicateError ? t('duplicateText') : t('lengthText');
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={async (e) => {
          e.preventDefault();
          if (allChannels.some((el) => el.name === inputValue)) {
            setError(!duplicateError);
          } else if (inputValue.length > 20) {
            setLengthError(!lengthError);
          } else {
            auth.socket.emit('newChannel', { name: inputValue }, (response) => {
              console.log(response.status); // ok
            });
            toast(t('channelAdded'));
          }
        }}
        >
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="visually-hidden">Имя канала</Form.Label>
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
            <Button variant="primary" type="submit">{t('send')}</Button>
          </Modal.Footer>
          {error && <div>{errorMessage}</div>}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
