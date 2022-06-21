import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';

export default function RenameChannelModal(props) {
  const auth = useAuth();
  const {
    modal, handle, id, name,
  } = props;
  const { show, id: modalId } = modal;
  const [inputValue, setValue] = useState('');
  const allChannels = useSelector((state) => state.channels.channels);
  const [error, setError] = useState(false);
  const errorClass = error === true ? 'is-invalid' : '';
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handle(modalId)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={async (evt) => {
          evt.preventDefault();
          if (allChannels.some((el) => el.name === inputValue)) {
            setError(!error);
          } else {
            auth.socket.emit('renameChannel', { id, name: inputValue }, (response) => {
              if (response.status !== 'ok') {
                toast(t('networkError'));
              }
            });
            toast(t('channelRenamed'));
            handle(modalId)();
            setValue('');
          }
        }}
        >
          <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
            <Form.Label className="visually-hidden">{t('channelName')}</Form.Label>
            <Form.Control type="text" autoFocus className={errorClass} value={inputValue === '' ? name : inputValue} onChange={(evt) => setValue(evt.target.value)} />
            {error && <div className="invalid-feedback">{t('duplicateText')}</div>}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handle(modalId)}>{t('close')}</Button>
            <Button variant="primary" type="submit">{t('send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
