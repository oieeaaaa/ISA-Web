import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';

// contexts
import useAppContext from 'js/contexts/app';

// utils
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import isObjectEmpty from 'js/utils/isObjectEmpty';

// shapes
import {
  initialValues,
  types,
  paymentTypes,
  addedItemsHeaders
} from 'js/shapes/sales-report';

// components
import FormActions from 'components/form-actions/form-actions';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Select from 'components/select/select';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import MultiInput from 'components/multi-input/multi-input';
import ProductsTable from 'components/products-table/products-table';
import TableSelect from 'components/table-select/table-select';
import AddToListModal from 'components/add-to-list-modal/add-to-list-modal';

const SalesReportForm = ({ mode = 'add', helpers, onSubmit }) => {
  // contexts
  const {
    status,
    values,
    errors,
    validateForm,
    setStatus,
    isSubmitting,
    setFieldValue
  } = useFormikContext();
  const { notification } = useAppContext();

  // state
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);

  // vars
  const { banks } = helpers;
  const isEditMode = mode === 'edit';
  const isAccount = values.type?.name === 'Account';
  const isCheque = values.saleFields?.paymentType?.name === 'Cheque';

  const openAddToListModal = (product) => {
    const item = checkIfProductExistInValues(product);

    if (item) {
      setFieldValue('listModal', {
        data: item,
        quantity: safety(item, 'inventory.plusQuantity', 0)
      });
    } else {
      setFieldValue('listModal.data', product);
    }

    setIsAddToListModalOpen(true);
  };

  const closeAddToListModal = () => {
    setFieldValue('listModal', initialValues.listModal);
    setIsAddToListModalOpen(false);
  };

  const checkIfProductExistInValues = (product) =>
    values.items.find((item) => item.id === product.id);

  const handleSubmit = async () => {
    if (!status?.isSubmitted) {
      setStatus({ isSubmitted: true });
    }

    const newErrors = await validateForm(values);

    if ('items' in newErrors) {
      notification.open({
        message: 'Please select sold items before submitting',
        variant: 'danger',
        duration: 5000
      });
    }

    if (!isObjectEmpty(newErrors)) return;

    onSubmit(values);
  };

  const removeSelectedItems = (selectedItems, isSelectedAll) => {
    if (isSelectedAll) return setFieldValue('items', initialValues.items); // reset items

    if (isEditMode) {
      setFieldValue('removedItems', [
        ...values.removedItems,
        ...selectedItems.reduce((removedItems, current) => {
          if (
            !current.itemID ||
            values.removedItems.some((ri) => ri.itemID === current.itemID)
          ) {
            return removedItems;
          }

          return [...removedItems, current];
        }, [])
      ]);
    }

    setFieldValue(
      'items',
      values.items.filter(
        (item) =>
          !selectedItems.some((selectedItem) => selectedItem.id === item.id)
      )
    );
  };

  useEffect(() => {
    if (!status?.isSubmitted) return;
    const validate = async () => await validateForm(values);

    validate();
  }, [status, isSubmitting, values]); // maybe listen to required values only

  return (
    <div className="sales-report-form">
      <FormActions
        icon="activity"
        title={isEditMode ? 'Update Sales Report' : 'Add Sales Report'}>
        <Button onClick={() => goTo('/sales-report')}>Go back</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isObjectEmpty(errors)}>
          {isEditMode ? 'Update' : 'Save'}
        </Button>
      </FormActions>
      <div className="sales-report-form-container">
        <div className="sales-report-form__top">
          <InputGroup
            name="type"
            label="Type"
            options={types}
            mainKey="name"
            error={safety(errors, 'type.name', 'Invalid type!')}
            component={Select}
          />
        </div>
        <FormSection title="Details">
          <div className="sales-report-form__group">
            <InputGroup name="name" label="Customer" component={Input} />
            {isAccount ? (
              <>
                <InputGroup
                  name="accountFields.drNumber"
                  label="DR Number"
                  component={Input}
                />
                <InputGroup
                  name="accountFields.crsNumber"
                  label="CRS Number"
                  component={Input}
                />
              </>
            ) : (
              <>
                <InputGroup
                  name="saleFields.tin"
                  label="Tin"
                  component={Input}
                />
                <InputGroup
                  name="saleFields.siNumber"
                  label="SI Number"
                  component={Input}
                />
                <InputGroup
                  name="saleFields.arsNumber"
                  label="ARS Number"
                  component={Input}
                />
              </>
            )}
          </div>
          <div className="sales-report-form__group">
            <InputGroup name="address" label="Address" component={TextArea} />
            <InputGroup
              name="salesStaff"
              label="Sales Staff"
              mainKey="name"
              captureRemoved={isEditMode}
              noIsNew
              component={MultiInput}
            />
          </div>
        </FormSection>
        <FormSection title="Payment">
          {isAccount ? (
            <InputGroup
              name="discount"
              label="Discount"
              type="number"
              component={Input}
            />
          ) : (
            <>
              <InputGroup
                name="saleFields.paymentType"
                label="Payment Type"
                options={paymentTypes}
                mainKey="name"
                error={safety(
                  errors,
                  'paymentType.name',
                  'Invalid payment type!'
                )}
                component={Select}
              />
              {isCheque ? (
                <>
                  <InputGroup
                    name="saleFields.bank"
                    label="Bank"
                    initialOptions={banks}
                    serverRoute="/helpers/bank"
                    component={InputSelectWithFetch}
                    error={safety(errors, 'bank.id', 'Invalid bank!')}
                  />
                  <InputGroup
                    name="saleFields.chequeNumber"
                    label="Cheque Number"
                    component={Input}
                  />
                  <InputGroup
                    name="saleFields.chequeDate"
                    label="Cheque Date"
                    minDate={new Date()}
                    component={DatePicker}
                  />
                </>
              ) : (
                <InputGroup
                  name="saleFields.amount"
                  label="Amount"
                  type="number"
                  component={Input}
                />
              )}
              <InputGroup
                name="discount"
                label="Discount"
                type="number"
                component={Input}
              />
            </>
          )}
        </FormSection>
      </div>
      <div className="purchase-order-form__table">
        <ProductsTable
          onCreateProduct={null}
          onClickProduct={openAddToListModal}
        />
      </div>
      {!!values.items.length && (
        <div className="purchase-order-form-container">
          <TableSelect
            title="Sold Items"
            headers={addedItemsHeaders}
            itemsKey="items"
            onSubmit={removeSelectedItems}
            submitButtonLabel="Remove Marked"
          />
        </div>
      )}
      <AddToListModal
        isOpen={isAddToListModalOpen}
        onClose={closeAddToListModal}
      />
    </div>
  );
};

export default SalesReportForm;
