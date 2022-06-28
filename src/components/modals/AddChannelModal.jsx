import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import useAuth from '../../hooks/index.jsx';

const SignupSchema = (allChannels) => Yup.object().shape({
  name: Yup.string()
    .min(3, 'lengthText')
    .max(20, 'lengthText')
    .required('required')
    .notOneOf(allChannels, 'duplicateText'),
});

export default function AddChannelModal(props) {
  const { modal, handle } = props;
  const allModals = useSelector((state) => state.modals.modals);
  const currentModal = allModals.find((el) => el.type === modal);
  const { show, type } = currentModal;
  const auth = useAuth();
  const allChannels = useSelector((state) => state.channels.channels);
  const channelsNames = allChannels.map((el) => el.name);
  const errorClass = (isValid) => (isValid !== true ? 'is-invalid mb-2 form-control' : 'mb-2 form-control');
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{ name: '' }}
      validationSchema={SignupSchema(channelsNames)}
      onSubmit={async (values) => {
        const { name } = values;
        auth.socket.emit('newChannel', { name }, (response) => {
          if (response.status !== 'ok') {
            toast(t('networkError'));
          }
        });
        toast(t('channelAdded'));
        handle(type)();
      }}
    >
      {({ errors, isValid }) => (
        <Modal show={show} onHide={handle(type)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('addChannel')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div>
                <Field className={errorClass(isValid)} name="name" id="nick" />
                <label className="visually-hidden" htmlFor="nick">{t('channelName')}</label>
                {!isValid && <div className="invalid-feedback">{t(errors.name)}</div> }
              </div>
              <div className="d-flex justify-content-end">
                <Button className="me-2" variant="secondary" onClick={handle(type)}>{t('close')}</Button>
                <Button variant="primary" type="submit">{t('send')}</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );
}
