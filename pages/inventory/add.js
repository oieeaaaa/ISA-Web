import { useState } from 'react';
import Layout from 'components/layout/layout';
import FormTitle from 'components/form-title/form-title';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import Select from 'components/select/select';
import Button from 'components/button/button';
import MultiSelect from 'components/multi-select/multi-select';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import MiniCard from 'components/mini-card/mini-card';

const InventoryAdd = () => {
  const [form, setForm] = useState({
    dateReceived: new Date(),
    referenceDateReceived: new Date(),
  });

  const handleDatePickerChange = (name, date) => {
    setForm({
      ...form,
      [name]: date,
    });
  };

  return (
    <Layout>
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
              <Button variant="primary">
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
            selected={form.dateReceived}
            onChange={(date) => handleDatePickerChange('dateReceived', date)}
          />
          <FormSection title="References">
            <InputGroup
              name="number"
              label="Number"
              component={Input}
            />
            <InputGroup
              name="referenceDateReceived"
              label="Date Received"
              component={DatePicker}
              selected={form.referenceDateReceived}
              onChange={(date) => handleDatePickerChange('referenceDateReceived', date)}
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
              component={Input}
              type="number"
            />
            <InputGroup
              name="applications"
              label="Applications"
              component={MultiSelect}
            />
            <InputGroup
              name="brands"
              label="Brands"
              component={MultiSelect}
            />
            <InputGroup
              name="supplier"
              label="Supplier"
              component={Select}
              options={[{ id: 'Test', name: 'test' }]}
            />
            <InputGroup
              name="description"
              label="Description"
              component={TextArea}
            />
          </FormSection>
          <FormSection title="Pricing">
            <InputGroup
              name="code"
              label="Code"
              component={MultiSelect}
            />
            <div className="inventory-add__pricing-info">
              <MiniCard title="Unit Cost" content="₱1870" />
              <MiniCard title="Amount" content="₱1870" />
            </div>
            <InputGroup
              name="uom"
              label="UOM"
              component={Input}
            />
            <InputGroup
              name="srp"
              label="SRP"
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
    </Layout>
  );
};

export default InventoryAdd;
