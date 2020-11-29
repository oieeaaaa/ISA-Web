import { Form, useFormikContext } from 'formik';
import useAppContext from 'js/contexts/app';
import codeCalc from 'js/utils/codeCalc';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import FormActions from 'components/form-actions/form-actions';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import Select from 'components/select/select';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import MiniCard from 'components/mini-card/mini-card';

const InventoryForm = ({ mode = 'add', helpers }) => {
  const { values, errors } = useFormikContext();
  const { codes } = useAppContext();
  const { uoms, brands, suppliers, applications } = helpers;

  console.log({ values });

  return (
    <Form>
      <div className="inventory-form">
        <FormActions title={mode === 'edit' ? 'Update Item' : 'Add Item'}>
          <Button onClick={() => goTo('/inventory')}>Cancel</Button>
          <Button variant="primary" type="submit">
            {mode === 'edit' ? 'Update Item' : 'Add Item'}
          </Button>
        </FormActions>
        <div className="inventory-form-container">
          <InputGroup
            name="dateReceived"
            label="Date Received"
            component={DatePicker}
          />
          <FormSection title="References">
            <InputGroup
              name="referenceNumber"
              label="Number"
              component={Input}
            />
            <InputGroup
              name="referenceDate"
              label="Date Received"
              component={DatePicker}
            />
          </FormSection>
          <FormSection title="Details">
            <InputGroup
              name="particular"
              label="Particular"
              component={Input}
            />
            <InputGroup
              name="partsNumber"
              label="Parts Number"
              component={Input}
            />
            <InputGroup name="size" label="Size" component={Input} />
            <InputGroup
              name="quantity"
              label="Quantity"
              type="number"
              component={Input}
            />
            <InputGroup
              name="applications"
              label="Applications"
              initialOptions={applications}
              serverRoute="/helpers/application"
              captureRemoved={mode === 'edit'}
              component={MultiSelectWithFetch}
            />
            <InputGroup
              name="brand"
              label="Brand"
              initialOptions={brands}
              serverRoute="/helpers/brand"
              component={InputSelectWithFetch}
              error={safety(errors, 'brand.name', 'Invalid brand!')}
            />
            <InputGroup
              name="supplier"
              label="Supplier"
              options={suppliers}
              component={Select}
              error={safety(errors, 'supplier.id', 'Invalid supplier!')}
              displayKey="initials"
            />
            <InputGroup
              name="description"
              label="Description"
              component={TextArea}
            />
          </FormSection>
          <FormSection title="Pricing">
            <InputGroup name="codes" label="Codes" component={Input} />
            <div className="inventory-form__pricing-info">
              <MiniCard
                title="Unit Cost"
                content={`₱${codeCalc(codes, values.codes)}`}
              />
              <MiniCard
                title="Amount"
                content={`₱${codeCalc(codes, values.codes)}`}
              />
            </div>
            <InputGroup
              name="uom"
              label="UOM"
              initialOptions={uoms}
              serverRoute="/helpers/uom"
              component={InputSelectWithFetch}
              error={safety(errors, 'uom.name', 'Invalid uom!')}
            />
            <InputGroup
              name="srp"
              label="SRP"
              type="number"
              component={Input}
            />
          </FormSection>
          <FormSection title="Other Info">
            <InputGroup name="remarks" label="Remarks" component={TextArea} />
            <InputGroup
              name="receivedBy"
              label="Received by"
              component={Input}
            />
            <InputGroup name="checkedBy" label="Checked by" component={Input} />
            <InputGroup name="codedBy" label="Coded by" component={Input} />
          </FormSection>
        </div>
      </div>
    </Form>
  );
};

export default InventoryForm;
