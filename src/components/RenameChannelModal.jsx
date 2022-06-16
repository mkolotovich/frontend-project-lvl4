import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';

export default function RenameChannelModal(props) {
  const auth = useAuth();
  const { show, handle, id } = props;
  const [inputValue, setValue] = useState('');
  const allChannels = useSelector((state) => state.channels.channels);
  const [error, setError] = useState(false);
  const errorClass = error === true ? 'is-invalid' : '';
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handle} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={async (e) => {
          e.preventDefault();
          if (allChannels.some((el) => el.name === inputValue)) {
            setError(!error);
          } else {
            auth.socket.emit('renameChannel', { id, name: inputValue }, (response) => {
              if (response.status !== 'ok') {
                toast(t('networkError'));
              }
            });
            toast(t('channelRenamed'));
          }
        }}
        >
          <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
            <Form.Label className="visually-hidden">Имя канала</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              className={errorClass}
              value={inputValue}
              onChange={(e) => setValue(e.target.value)}
            />
            {error && <div className="invalid-feedback">{t('duplicateText')}</div>}
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handle}>
              {t('close')}
            </Button>
            <Button variant="primary" type="submit">{t('send')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
