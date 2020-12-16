import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useFormikContext } from 'formik';
import messages from 'js/messages';
import useAppContext from 'js/contexts/app';
import useLayoutContext from 'js/contexts/layout';
import { AUTH_KEY } from 'js/shapes/cookies';
import fetcher from 'js/utils/fetcher';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import safety from 'js/utils/safety';
import Modal from 'components/modal/modal';
import ModalActions from 'components/modal-actions/modal-actions';
import Button from 'components/button/button';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';

const Profile = ({ isOpen, onClose }) => {
  // contexts
  const { notification } = useAppContext();
  const { auth } = useLayoutContext();
  const {
    values,
    validateForm,
    status,
    isSubmitting,
    setStatus,
    errors,
    setValues
  } = useFormikContext();

  const [cookies, setCookie] = useCookies([AUTH_KEY]);

  const handleSubmit = async () => {
    setStatus({ isSubmitted: true });

    const newErrors = await validateForm(values);

    if (!isObjectEmpty(newErrors)) return;

    try {
      await fetcher(`/user/${safety(auth, 'user.id', '')}`, {
        method: 'PUT',
        body: JSON.stringify(values)
      });

      notification.open({
        variant: 'success',
        message: 'Updated profile!'
      });

      // update cookie
      setCookie(AUTH_KEY, {
        ...cookies[AUTH_KEY],
        user: {
          ...cookies[AUTH_KEY].user,
          ...values
        }
      });
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

  useEffect(() => {
    if (!auth.user) return;

    const { displayName, username } = auth.user;

    setValues({
      displayName,
      username
    });
  }, [auth.user]);

  return (
    <div className="profile">
      <Modal isOpen={isOpen} title="Profile" closeModal={onClose}>
        <InputGroup name="displayName" label="Display Name" component={Input} />
        <InputGroup name="username" label="Username" component={Input} />
        <ModalActions mode="single">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isObjectEmpty(errors)}>
            Update profile
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
};

export default Profile;
