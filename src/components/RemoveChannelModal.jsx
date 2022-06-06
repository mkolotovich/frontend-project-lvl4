import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';

export default function RemoveChannelModal(props) {
  const auth = useAuth();
  const { show, handle, channel } = props;
  const allChannels = useSelector((state) => state.channels.channels);
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handle}>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('sure')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handle}>
          {t('close')}
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            const channelWithOutHash = channel.slice(2);
            const { id } = allChannels.find((el) => el.name === channelWithOutHash);
            console.log(id);
            auth.socket.emit('removeChannel', { id }, (response) => {
              console.log(response.status); // ok
            });
            toast(t('channelRemoved'));
          }}
        >
          {t('remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
