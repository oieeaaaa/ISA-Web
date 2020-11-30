import { useFormikContext } from 'formik';
import messages from 'js/messages';
import fetcher from 'js/utils/fetcher';
import useAppContext from 'js/contexts/app';
import Modal from 'components/modal/modal';
import ModalActions from 'components/modal-actions/modal-actions';
import Button from 'components/button/button';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';

const Profile = ({ isOpen, onClose }) => {
  // contexts
  const { notification } = useAppContext();
  const { values } = useFormikContext();

  const { displayName, email } = values;

  const handleSubmit = async () => {
    try {
      await fetcher('/helpers/profile', {
        method: 'POST',
        body: JSON.stringify({ displayName, email })
      });

      notification.open({
        variant: 'success',
        message: messages.success.update
      });
    } catch (error) {
      notification.open({
        variant: 'danger',
        message: messages.error.add
      });
    }
  };

  return (
    <div className="profile">
      <Modal isOpen={isOpen} title="Profile" closeModal={onClose}>
        <InputGroup name="displayName" label="Display Name" component={Input} />
        <InputGroup name="email" label="Email" type="email" component={Input} />
        <ModalActions mode="single">
          <Button variant="primary" onClick={handleSubmit}>
            Update profile
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
};

export default Profile;
