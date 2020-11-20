import { Form, useFormikContext } from 'formik';
import safety from 'js/utils/safety';
import FormTitle from 'components/form-title/form-title';
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

const InventoryForm = ({ helpers }) => {
  const { errors } = useFormikContext();

  const { uoms, brands, suppliers, applications } = helpers;

  return (
    <Form>
      <div className="inventory-add">
        <div className="inventory-add-top">
          <div className="inventory-add-container grid">
            <FormTitle icon="archive" title="Add Item" />
          </div>
          <div className="inventory-add-actions">
            <div className="grid">
              <Button>Cancel</Button>
              <Button variant="primary" type="submit">
                Add Item
              </Button>
            </div>
          </div>
        </div>
        <div className="inventory-add-container grid">
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
            />
            <InputGroup
              name="description"
              label="Description"
              component={TextArea}
            />
          </FormSection>
          <FormSection title="Pricing">
            <InputGroup name="codes" label="Codes" component={Input} />
            <div className="inventory-add__pricing-info">
              <MiniCard title="Unit Cost" content="₱1870" />
              <MiniCard title="Amount" content="₱1870" />
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
