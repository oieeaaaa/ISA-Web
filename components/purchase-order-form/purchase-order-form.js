import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

// contexts
import useAppContext from 'js/contexts/app';

// utils
import isObjectEmpty from 'js/utils/isObjectEmpty';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import dateFormat from 'js/utils/dateFormat';

// shapes
import { initialValues, addedItemsHeaders } from 'js/shapes/purchase-order';

// components
import AddToListModal from 'components/add-to-list-modal/add-to-list-modal';
import FormActions from 'components/form-actions/form-actions';
import InputGroup from 'components/input-group/input-group';
import InputDisplay from 'components/input-display/input-display';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Button from 'components/button/button';
import ProductsTable from 'components/products-table/products-table';
import TableSelect from 'components/table-select/table-select';

const PurchaseOrderForm = ({ mode = 'add', helpers, onSubmit }) => {
  // contexts
  const {
    values,
    errors,
    setFieldValue,
    validateForm,
    status,
    isSubmitting,
    setStatus
  } = useFormikContext();
  const { notification } = useAppContext();

  // state
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);

  // destructures
  const { suppliers, tracking } = helpers;

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
        message: 'Please select an items to purchase before submitting',
        variant: 'danger',
        duration: 5000
      });
    }

    if (!isObjectEmpty(newErrors)) return;

    onSubmit(values);
  };

  const removeSelectedItems = (selectedItems, isSelectedAll) => {
    if (isSelectedAll) return setFieldValue('items', initialValues.items); // reset items

    setFieldValue(
      'items',
      values.items.filter(
        (item) =>
          !selectedItems.some((selectedItem) => selectedItem.id === item.id)
      )
    );
  };

  const onChangeSupplier = (value) => {
    const isShouldResetItems =
      value?.id === values.supplier.id && values.items.length;

    if (!isShouldResetItems) return;

    // reset the inventory fields
    setFieldValue('items', []);

    notification.open({
      message:
        'A new supplier has been selected. We will reset all of your selected items',
      variant: 'danger',
      duration: 5000
    });
  };

  useEffect(() => {
    if (!status?.isSubmitted) return;
    const validate = async () => await validateForm(values);

    validate();
  }, [status, isSubmitting, values]); // maybe listen to required values only

  return (
    <div className="purchase-order-form">
      <FormActions
        icon="clipboard"
        title={mode === 'view' ? 'View purchase order' : 'Add Purchase Order'}>
        <Button onClick={() => goTo('/purchase-order')}>Go back</Button>
        {mode === 'add' && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isObjectEmpty(errors)}>
            {mode === 'edit' ? 'Update PO' : 'Add PO'}
          </Button>
        )}
      </FormActions>
      <div className="purchase-order-form-container">
        <div className="purchase-order-form__group purchase-order-form__group--top">
          {mode === 'view' ? (
            <>
              <InputGroup
                name="dateCreated"
                label="Date Created"
                component={InputDisplay}
                formatVal={dateFormat}
              />
              <InputGroup
                name="supplier"
                label="Supplier"
                component={InputDisplay}
                formatVal={(val) => val.vendor}
              />
            </>
          ) : (
            <>
              <InputGroup
                name="supplier"
                label="Supplier"
                initialOptions={suppliers}
                mainKey="initials"
                serverRoute="/helpers/supplier"
                error={safety(errors, 'supplier.id', 'Invalid supplier!')}
                onSelect={onChangeSupplier}
                component={InputSelectWithFetch}
              />
              <InputGroup
                name="tracking"
                label="Tracking"
                initialOptions={tracking}
                mainKey="address"
                serverRoute="/helpers/tracking"
                error={safety(errors, 'tracking.address', 'Invalid tracking')}
                noIsNew
                component={InputSelectWithFetch}
              />
            </>
          )}
        </div>
      </div>
      <div className="purchase-order-form__table">
        <ProductsTable
          onCreateProduct={null}
          onClickProduct={openAddToListModal}
        />
      </div>
      {!!values.items.length && (
        <div className="stock-in-form-container">
          <TableSelect
            title="Items to PO"
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

export default PurchaseOrderForm;
