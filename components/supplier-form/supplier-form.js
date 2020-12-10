import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import goTo from 'js/utils/goTo';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import FormActions from 'components/form-actions/form-actions';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import MultiInput from 'components/multi-input/multi-input';

const SupplierForm = ({ onSubmit, onDelete, mode = 'add', helpers }) => {
  const {
    setStatus,
    status,
    values,
    isSubmitting,
    validateForm
  } = useFormikContext();

  const { brands } = helpers;

  const handleSubmit = async () => {
    if (!status?.isSubmitted) {
      setStatus({ isSubmitted: true });
    }

    const newErrors = await validateForm(values);

    if (!isObjectEmpty(newErrors)) return;

    onSubmit(values);
  };

  useEffect(() => {
    if (!status?.isSubmitted) return;
    const validate = async () => await validateForm(values);

    validate();
  }, [status, isSubmitting, values]); // maybe listen to required values only

  return (
    <div className="supplier-form">
      <FormActions
        icon="list"
        title={mode === 'edit' ? 'Update Supplier' : 'Add Supplier'}>
        <Button onClick={() => goTo('/supplier')}>Go back</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {mode === 'edit' ? 'Update supplier' : 'Add new supplier'}
        </Button>
      </FormActions>
      <div className="supplier-form-container">
        <FormSection title="Details">
          <InputGroup name="vendor" label="Vendor" component={Input} />
          <InputGroup
            name="entry"
            label="Entry"
            maxDate={new Date()}
            component={DatePicker}
          />
          <InputGroup name="address" label="Address" component={TextArea} />
          <InputGroup name="initials" label="Initials" component={Input} />
          <InputGroup
            name="terms"
            label="Terms (days)"
            type="number"
            component={Input}
          />
          <InputGroup name="tin" label="Tin" component={Input} />
        </FormSection>
        <FormSection title="Company">
          <InputGroup name="owner" label="Owner" component={Input} />
          <InputGroup
            name="brands"
            label="Brands"
            initialOptions={brands}
            serverRoute="/helpers/brand"
            captureRemoved={mode === 'edit'}
            noIsNew
            component={MultiSelectWithFetch}
          />
        </FormSection>
        <FormSection title="Contact">
          <InputGroup
            name="representative"
            label="Representative"
            component={Input}
          />
          <InputGroup
            name="representativePhoneNumbers"
            label="Representative Phone Numbers"
            captureRemoved={mode === 'edit'}
            mainKey="phoneNumber"
            noIsNew
            component={MultiInput}
          />
          <InputGroup
            name="emails"
            label="Emails"
            captureRemoved={mode === 'edit'}
            mainKey="email"
            noIsNew
            component={MultiInput}
          />
          <InputGroup
            name="companyPhoneNumbers"
            label="Company Phone Numbers"
            captureRemoved={mode === 'edit'}
            mainKey="phoneNumber"
            noIsNew
            component={MultiInput}
          />
        </FormSection>
      </div>
      <div className="supplier-form-container supplier-form-container__with-delete">
        {mode === 'edit' && (
          <Button
            className="supplier-form__delete"
            variant="danger"
            onClick={onDelete}>
            Delete supplier
          </Button>
        )}
      </div>
    </div>
  );
};

export default SupplierForm;
