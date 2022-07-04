import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/index.jsx';

export default function RemoveChannelModal(props) {
  const auth = useAuth();
  const { modal, handle } = props;
  const modals = useSelector((state) => state.modals.modals);
  const { isShow, type, channel } = modals;
  const id = channel === null ? null : channel.id;
  const { t } = useTranslation();
  return (
    <Modal show={type === modal && isShow} onHide={handle(type)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('sure')}
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={handle(type)}>{t('close')}</Button>
          <Button
            variant="danger"
            onClick={async () => {
              auth.socket.emit('removeChannel', { id }, (response) => {
                if (response.status !== 'ok') {
                  toast(t('networkError'));
                }
              });
              toast(t('channelRemoved'));
              handle()();
            }}
          >
            {t('remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
