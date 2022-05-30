import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { socket } from './App.jsx';

export default (props) => {
  const { show, handleClose, channel } = props;
  const allChannels = useSelector((state) => state.channels.value);
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('sure')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('close')}
        </Button>
        <Button variant="primary" onClick={async() => {
          const { id } = allChannels.find((el) => el.name === channel);
          console.log(id);
          socket.emit('removeChannel', {id}, (response) => {
            console.log(response.status); // ok
          });
        }}>
          {t('remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}