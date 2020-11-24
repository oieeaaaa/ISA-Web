import { Form } from 'formik';
import goTo from 'js/utils/goTo';
import FormActions from 'components/form-actions/form-actions';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import MultiInput from 'components/multi-input/multi-input';

const SupplierForm = ({ mode = 'add', helpers }) => {
  const { brands } = helpers;

  return (
    <Form>
      <div className="supplier-form">
        <FormActions
          title={mode === 'edit' ? 'Update Supplier' : 'Add Supplier'}>
          <Button onClick={() => goTo('/supplier')}>Cancel</Button>
          <Button variant="primary" type="submit">
            {mode === 'edit' ? 'Update supplier' : 'Add new supplier'}
          </Button>
        </FormActions>
        <div className="supplier-form-container">
          <FormSection title="Details">
            <InputGroup name="vendor" label="Vendor" component={Input} />
            <InputGroup name="entry" label="Entry" component={DatePicker} />
            <InputGroup name="address" label="Address" component={TextArea} />
            <InputGroup name="initials" label="Initials" component={Input} />
            <InputGroup
              name="terms"
              label="Terms"
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
              component={MultiInput}
              mainKey="phoneNumber"
            />
            <InputGroup
              name="emails"
              label="Emails"
              component={MultiInput}
              mainKey="email"
            />
            <InputGroup
              name="companyPhoneNumbers"
              label="Company Phone Numbers"
              component={MultiInput}
              mainKey="phoneNumber"
            />
          </FormSection>
        </div>
      </div>
    </Form>
  );
};

export default SupplierForm;
