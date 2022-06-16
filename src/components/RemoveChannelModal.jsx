import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';

export default function RemoveChannelModal(props) {
  const auth = useAuth();
  const { show, handle, id } = props;
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handle} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('sure')}
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={handle}>
            {t('close')}
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              auth.socket.emit('removeChannel', { id }, (response) => {
                if (response.status !== 'ok') {
                  toast(t('networkError'));
                }
              });
              toast(t('channelRemoved'));
            }}
          >
            {t('remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
