import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';

export default function AddChannelModal(props) {
  const { modal, handle } = props;
  const { show, id } = modal;
  const auth = useAuth();
  const [inputValue, setValue] = useState('');
  const allChannels = useSelector((state) => state.channels.channels);
  const [duplicateError, setError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const error = !!(duplicateError || lengthError);
  const errorClass = error === true ? 'is-invalid' : '';
  const { t } = useTranslation();
  const errorMessage = duplicateError ? t('duplicateText') : t('lengthText');
  const minLength = 3;
  const maxLength = 20;
  return (
    <Modal show={show} onHide={handle(id)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={async (evt) => {
          evt.preventDefault();
          if (allChannels.some((el) => el.name === inputValue)) {
            setError(!duplicateError);
          } else if (inputValue.length > maxLength || inputValue.length < minLength) {
            setLengthError(true);
          } else {
            auth.socket.emit('newChannel', { name: inputValue }, (response) => {
              if (response.status !== 'ok') {
                toast(t('networkError'));
              }
            });
            toast(t('channelAdded'));
            handle(id)();
          }
        }}
        >
          <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
            <Form.Label className="visually-hidden">Имя канала</Form.Label>
            <Form.Control type="text" autoFocus className={errorClass} value={inputValue} onChange={(e) => setValue(e.target.value)} />
            {error && <div className="invalid-feedback">{errorMessage}</div>}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handle(id)}>{t('close')}</Button>
            <Button variant="primary" type="submit">{t('send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
