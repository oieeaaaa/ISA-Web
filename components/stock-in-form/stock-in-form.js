import { useFormikContext } from 'formik';
import { addedItemsHeaders } from 'js/shapes/stock-in';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import FormActions from 'components/form-actions/form-actions';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import Table from 'components/table/table';
import TableSelect from 'components/table-select/table-select';

const StockInForm = ({ mode = 'add', helpers, onSubmit }) => {
  const { values, errors } = useFormikContext();
  const { suppliers, receivedBy, codedBy, checkedBy } = helpers;

  return (
    <div className="stock-in-form">
      <FormActions
        title={mode === 'edit' ? 'Update Stock In' : 'Create a Stock In'}>
        <Button onClick={() => goTo('/stock-in')}>Go back</Button>
        <Button variant="primary" type="submit" onClick={onSubmit}>
          {mode === 'edit' ? 'Update' : 'Save'}
        </Button>
      </FormActions>
      <div className="stock-in-form-container">
        <FormSection title="References">
          <InputGroup
            name="referenceNumber"
            label="Reference Number"
            component={Input}
          />
          <InputGroup
            name="referenceDate"
            label="Reference Date"
            component={DatePicker}
          />
          <InputGroup
            name="supplier"
            label="Supplier"
            initialOptions={suppliers}
            mainKey="initials"
            serverRoute="/helpers/supplier"
            error={safety(errors, 'supplier.id', 'Invalid supplier!')}
            component={InputSelectWithFetch}
          />
        </FormSection>
        <FormSection title="Details">
          <InputGroup name="remarks" label="Remarks" component={TextArea} />
          <div className="stock-in__group stock-in__group--details">
            <InputGroup
              name="receivedBy"
              label="Received By"
              mainKey="receivedBy"
              serverRoute="/helpers/received-by"
              initialOptions={receivedBy}
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="checkedBy"
              label="Checked By"
              mainKey="checkedBy"
              serverRoute="/helpers/checked-by"
              initialOptions={checkedBy}
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="codedBy"
              label="Coded By"
              mainKey="codedBy"
              serverRoute="/helpers/coded-by"
              initialOptions={codedBy}
              component={InputSelectWithFetch}
            />
          </div>
        </FormSection>
      </div>
      <div className="stock-in-form__table">
        <Table
          local
          title="Items"
          icon="clipboard"
          headers={[]}
          data={[]}
          sortOptions={[]}
        />
      </div>
      <div className="stock-in-form-container">
        <TableSelect
          title="Added Items"
          headers={addedItemsHeaders}
          itemsKey="items"
          onSubmit={console.log}
          submitButtonLabel="Remove Marked"
        />
      </div>
    </div>
  );
};

export default StockInForm;
