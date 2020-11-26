import { Form, useFormikContext } from 'formik';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import {
  soldItemsHeaders,
  soldItemsFilters,
  soldItemsSortOptions
} from 'js/shapes/sales-report';
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
import MultiInput from 'components/multi-input/multi-input';
import MediumCard from 'components/medium-card/medium-card';
import TableWithFetch from 'components/table-with-fetch/table-with-fetch';

// TODO:
// Integrate the table ✅
// Setup table's props ✅
// Add Item Modal
// Update Item Modal
// Delete Item Modal
// Styles ✅
const SalesReportForm = ({ mode = 'add', helpers, onSubmit }) => {
  const { values, errors, isValid, resetForm } = useFormikContext();
  const {
    banks,
    salesTypes,
    paymentTypes,
    brands,
    suppliers,
    applications
  } = helpers;

  const soldItemsParameterizer = ({ brand, supplier, applications }) => ({
    'brand.id': brand.id,
    'supplier.id': supplier.id,
    'applications_multiple.id': applications.map(({ id }) => id).join(',')
  });

  const handleSubmit = () => {
    if (!isValid) return;

    onSubmit(values, { resetForm });
  };

  return (
    <Form>
      <div className="sales-report-form">
        <FormActions
          title={mode === 'edit' ? 'Update Sales Report' : 'Add Sales Report'}>
          <Button onClick={() => goTo('/sales-report')}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {mode === 'edit' ? 'Update SR' : 'Add SR'}
          </Button>
        </FormActions>
        <div className="sales-report-form-container">
          <div className="sales-report-form__top">
            <InputGroup
              name="type"
              label="Type"
              initialOptions={salesTypes}
              serverRoute="/helpers/sales-type"
              component={InputSelectWithFetch}
              error={safety(errors, 'type.name', 'Invalid type!')}
            />
            <InputGroup
              name="dateCreated"
              label="Date Created"
              component={DatePicker}
            />
          </div>
          <FormSection title="Details">
            <div className="sales-report-form__group">
              <InputGroup name="name" label="Name" component={Input} />
              <InputGroup name="tin" label="Tin" component={Input} />
              <InputGroup name="siNumber" label="SI Number" component={Input} />
              <InputGroup
                name="arsNumber"
                label="ARS Number"
                component={Input}
              />
            </div>
            <div className="sales-report-form__group">
              <InputGroup name="address" label="Address" component={TextArea} />
              <InputGroup
                name="salesStaff"
                label="Sales Staff"
                component={MultiInput}
                mainKey="name"
              />
            </div>
          </FormSection>
          <FormSection title="Payment">
            <InputGroup
              name="paymentType"
              label="Type"
              initialOptions={paymentTypes}
              serverRoute="/helpers/payment-type"
              component={InputSelectWithFetch}
              error={safety(errors, 'type.id', 'Invalid payment type!')}
            />
            <InputGroup
              name="discount"
              label="Discount"
              type="number"
              component={Input}
            />
            <InputGroup
              name="bank"
              label="Bank"
              initialOptions={banks}
              serverRoute="/helpers/bank"
              component={InputSelectWithFetch}
              error={safety(errors, 'bank.id', 'Invalid bank!')}
            />
            <InputGroup name="chequeNumber" label="Number" component={Input} />
            <InputGroup name="chequeDate" label="Date" component={DatePicker} />
          </FormSection>
          <div className="sales-report-form__pricing-info">
            <MediumCard title="Gross Sales" content="₱20,602.00" />
            <MediumCard title="Net Sales" content="₱20,102.00" />
            <MediumCard title="Discounts" content="₱500" />
          </div>
        </div>
      </div>
      <div className="sales-report-form__table">
        <TableWithFetch
          serverRoute="inventory"
          parameterizer={soldItemsParameterizer}
          title="Sold Items"
          icon="clipboard"
          headers={soldItemsHeaders}
          data={values.soldItems}
          totalItems={values.soldItems.length}
          filters={soldItemsFilters}
          sortOptions={soldItemsSortOptions}
          renderFilter={() => (
            <div className="sales-report-form__sold-item-filters">
              <InputGroup
                name="brand"
                label="Brand"
                component={Select}
                options={brands}
                mainKey="name"
              />
              <InputGroup
                name="supplier"
                label="Supplier"
                component={Select}
                options={suppliers}
                mainKey="name"
              />
              <InputGroup
                name="applications"
                label="Applications"
                initialOptions={applications}
                serverRoute="/helpers/application"
                component={MultiSelectWithFetch}
                noCreate
              />
            </div>
          )}
        />
      </div>
    </Form>
  );
};

export default SalesReportForm;
