import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import useLayoutContext from 'js/contexts/layout';
import fetcher from 'js/utils/fetcher';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import safety from 'js/utils/safety';
import Modal from 'components/modal/modal';
import ModalActions from 'components/modal-actions/modal-actions';
import Button from 'components/button/button';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';

const ChangePassword = ({ isOpen, onClose }) => {
  // contexts
  const { notification } = useAppContext();
  const { auth } = useLayoutContext();
  const {
    values,
    validateForm,
    status,
    isSubmitting,
    setStatus,
    errors
  } = useFormikContext();

  const handleSubmit = async () => {
    setStatus({ isSubmitted: true });

    const newErrors = await validateForm(values);

    if (!isObjectEmpty(newErrors)) return;

    try {
      await fetcher(`/auth/${safety(auth, 'user.id', '')}/change-password`, {
        method: 'PUT',
        body: JSON.stringify(values)
      });

      notification.open({
        variant: 'success',
        message: 'Updated password!'
      });

      auth.logout();
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.add
      });
    }
  };

  useEffect(() => {
    if (!status?.isSubmitted) return;
    const validate = async () => await validateForm(values);

    validate();
  }, [status, isSubmitting, values]); // maybe listen to required values only

  return (
    <div className="change-password">
      <Modal isOpen={isOpen} title="Change Password" closeModal={onClose}>
        <InputGroup
          name="oldPassword"
          label="Old Password"
          type="password"
          component={Input}
        />
        <InputGroup
          name="newPassword"
          label="New Password"
          type="password"
          component={Input}
        />
        <InputGroup
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          component={Input}
        />
        <ModalActions mode="single">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isObjectEmpty(errors)}>
            Update password
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
};

export default ChangePassword;
