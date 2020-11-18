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

const InventoryForm = ({
  helpers,
  formikProps,
  onSubmit,
}) => {
  const {
    uoms,
    brands,
    suppliers,
    applications,
    codes,
  } = helpers;

  const handleSubmit = () => {
    onSubmit(formikProps.values);
  };

  return (
    <div className="inventory-add">
      <div className="inventory-add-top">
        <div className="inventory-add-container grid">
          <FormTitle icon="archive" title="Add Item" />
        </div>
        <div className="inventory-add-actions">
          <div className="grid">
            <Button>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
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
          <InputGroup
            name="size"
            label="Size"
            component={Input}
          />
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
          />
          <InputGroup
            name="supplier"
            label="Supplier"
            options={suppliers}
            component={Select}
          />
          <InputGroup
            name="description"
            label="Description"
            component={TextArea}
          />
        </FormSection>
        <FormSection title="Pricing">
          <InputGroup
            name="codes"
            label="Code"
            initialOptions={codes}
            serverRoute="/helpers/code"
            component={MultiSelectWithFetch}
          />
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
          />
          <InputGroup
            name="srp"
            label="SRP"
            type="number"
            component={Input}
          />
        </FormSection>
        <FormSection title="Other Info">
          <InputGroup
            name="remarks"
            label="Remarks"
            component={TextArea}
          />
          <InputGroup
            name="receivedBy"
            label="Received by"
            component={Input}
          />
          <InputGroup
            name="checkedBy"
            label="Checked by"
            component={Input}
          />
          <InputGroup
            name="codedBy"
            label="Coded by"
            component={Input}
          />
        </FormSection>
      </div>
    </div>
  );
};

export default InventoryForm;
