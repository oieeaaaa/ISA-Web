import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import omit from 'lodash.omit';
import messages from 'js/messages';
import fetcher from 'js/utils/fetcher';
import useAppContext from 'js/contexts/app';
import Modal from 'components/modal/modal';
import ModalActions from 'components/modal-actions/modal-actions';
import Button from 'components/button/button';
import InputGroup from 'components/input-group/input-group';
import MultiInput from 'components/multi-input/multi-input';
import Input from 'components/input/input';

const Settings = ({ isOpen, onClose }) => {
  // contexts
  const { codes, notification } = useAppContext();
  const { values, setValues } = useFormikContext();

  const handleSubmit = async () => {
    try {
      await fetcher('/helpers/code', {
        method: 'POST',
        body: JSON.stringify(
          values.codes.map((code) => omit(code, ['undefined', 'isNew']))
        )
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

  useEffect(() => {
    setValues({ codes });
  }, [codes]);

  return (
    <div className="settings">
      <Modal isOpen={isOpen} title="Settings" closeModal={onClose}>
        <div className="settings__theme">
          <h4 className="settings__heading">Theme</h4>
          <Button variant="dark">Dark Mode</Button>
        </div>
        <InputGroup
          name="codes"
          label="Codes"
          component={MultiInput}
          customInput={({ name }) => (
            <div className="settings__codes">
              <Input
                className="settings__codes-name"
                name={`${name}.name`}
                max={1}
              />
              <Input
                className="settings__codes-value"
                name={`${name}.value`}
                type="number"
              />
            </div>
          )}
        />
        <ModalActions mode="single">
          <Button variant="primary" onClick={handleSubmit}>
            Update settings
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
};

export default Settings;
