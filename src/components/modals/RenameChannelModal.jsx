import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import useAuth from '../../hooks/index.jsx';

const SignupSchema = (allChannels) => Yup.object().shape({
  channelName: Yup.string()
    .notOneOf(allChannels, 'duplicateText'),
});

export default function RenameChannelModal(props) {
  const auth = useAuth();
  const { modal, handle } = props;
  const modals = useSelector((state) => state.modals.modals);
  const { isShow, type, channel } = modals;
  const id = channel === null ? null : channel.id;
  const name = channel === null ? null : channel.name;
  const allChannels = useSelector((state) => state.channels.channels);
  const channelsNames = allChannels.map((el) => el.name);
  const errorClass = (isValid) => (isValid !== true ? 'is-invalid mb-2 form-control' : 'mb-2 form-control');
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{ channelName: '' }}
      validate={(values) => {
        const errors = {};
        const channelName = values.channelName === '' ? name : values.channelName;
        if (allChannels.some((el) => el.name === channelName)) {
          errors.channelName = 'duplicateText';
        }
        return errors;
      }}
      validationSchema={SignupSchema(channelsNames)}
      onSubmit={async (values) => {
        const value = values;
        auth.socket.emit('renameChannel', { id, name: values.channelName }, (response) => {
          if (response.status !== 'ok') {
            toast(t('networkError'));
          }
        });
        toast(t('channelRenamed'));
        handle()();
        value.channelName = '';
      }}
    >
      {({ errors, isValid, values }) => (
        <Modal show={type === modal && isShow} onHide={handle(type)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t('renameChannel')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div>
                <Field className={errorClass(isValid)} name="channelName" id="nick" value={values.channelName === '' ? name : values.channelName} />
                <label className="visually-hidden" htmlFor="nick">{t('channelName')}</label>
                {!isValid && <div className="invalid-feedback">{t(errors.channelName)}</div> }
              </div>
              <div className="d-flex justify-content-end">
                <Button className="me-2" variant="secondary" onClick={handle(id)}>{t('close')}</Button>
                <Button variant="primary" type="submit">{t('send')}</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );
}
