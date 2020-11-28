import { useEffect, useState } from 'react';
import { Form, useFormikContext } from 'formik';

// contexts
import useAppContext from 'js/contexts/app';

// utils
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import dateFormat from 'js/utils/dateFormat';

// shapes
import {
  itemsHeaders,
  itemsSortOptions,
  initialValues
} from 'js/shapes/purchase-order';

// components
import Modal from 'components/modal/modal';
import ModalInfoText from 'components/modal-info-text/modal-info-text';
import ModalInfoDetails from 'components/modal-info-details/modal-info-details';
import ModalActions from 'components/modal-actions/modal-actions';
import FormActions from 'components/form-actions/form-actions';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import InputDisplay from 'components/input-display/input-display';
import Select from 'components/select/select';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import MediumCard from 'components/medium-card/medium-card';
import Table from 'components/table/table';

const PurchaseOrderForm = ({ mode = 'add', helpers, onSubmit }) => {
  // contexts
  const {
    values,
    errors,
    isValid,
    resetForm,
    setFieldValue,
    dirty
  } = useFormikContext();
  const { notification } = useAppContext();

  // state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // destructures
  const { suppliers } = helpers;
  const { modal } = values;
  const { selectedItem, selectedQuantity } = modal;

  const handleSubmit = () => {
    if (errors.items) {
      notification.open({
        message: 'Items to PO is required!',
        variant: 'danger'
      });
    }

    if (!isValid) return;

    onSubmit(values, { resetForm });
  };

  const openAddModal = () => {
    if (!values.supplier.id) {
      notification.open({
        message: 'Please select a supplier first',
        variant: 'danger'
      });

      return;
    }

    setIsModalOpen(true);
    setFieldValue('modal', initialValues.modal);
  };

  const closeModal = () => setIsModalOpen(false);

  const isItemInSoldItems = values.items.some(
    (si) => si.id === selectedItem.id
  );

  const openUpdateModal = (item) => {
    setIsModalOpen(true);

    setFieldValue('modal', {
      ...modal,
      mode: 'edit',
      selectedItem: {
        ...item,
        quantity: item.quantity
      },
      selectedQuantity: item.selectedQuantity
    });
  };

  // TODO: Only use setFieldValue once, maybe replace it with setFormValues??
  const handleAddItem = () => {
    if (isItemInSoldItems) {
      notification.open({
        message: 'Your item is already in the list',
        variant: 'danger',
        duration: 3000
      });

      return;
    }

    // add new item to items
    setFieldValue(
      'items',
      values.items.concat({
        ...selectedItem,
        selectedQuantity
      })
    );

    // reset modal
    setFieldValue('modal', initialValues.modal);

    // success message
    notification.open({
      message: 'Yay! New item is added 🎉',
      variant: 'success'
    });
  };

  const handleUpdateItem = () => {
    if (!isItemInSoldItems) return;

    setFieldValue(
      'items',
      // we only need to update the selectedQuantity, so I'm doing this
      values.items.map((si) =>
        si.id === selectedItem.id ? { ...si, selectedQuantity } : si
      )
    );

    // success message
    notification.open({
      message: 'Updated item! ✨',
      variant: 'success'
    });
  };

  const handleRemoveItem = () => {
    if (!isItemInSoldItems) return;

    setFieldValue(
      'items',
      values.items.filter((si) => si.id !== selectedItem.id)
    );

    setFieldValue('modal', initialValues.modal);

    closeModal();
  };

  useEffect(() => {
    // Reset items if the supplier changed
    if (dirty && mode === 'add' && values.items.length) {
      setFieldValue('items', initialValues.items);

      notification.open({
        message: 'Items is cleared 🗑',
        variant: 'success'
      });
    }
  }, [values.supplier, dirty]);

  return (
    <Form>
      <Modal
        title={modal.mode === 'add' ? 'Add Item' : 'Update Item'}
        isOpen={isModalOpen}
        closeModal={closeModal}>
        <ModalInfoText>
          {modal.mode === 'add'
            ? 'Add another item for purchase order to display on this items list.'
            : 'Update item for purchase order to display on this items list.'}
        </ModalInfoText>
        <InputGroup
          takeWhole
          name="modal.selectedItem"
          label="Your item"
          initialOptions={[]}
          serverRoute="/helpers/inventory"
          filters={{ supplierID: values.supplier.id }}
          component={InputSelectWithFetch}
          mainKey="particular"
          disabled={modal.mode === 'edit'}
          error={safety(errors, 'soldItem.data.id', 'Invalid Item!')}
        />
        <InputGroup
          name="modal.selectedQuantity"
          label="Quantity"
          type="number"
          component={Input}
          max={selectedItem.quantity}
        />
        {selectedItem.id && (
          <ModalInfoDetails
            details={[
              {
                title: 'Supplier',
                value: selectedItem.supplier.initials
              },
              {
                title: 'Brand',
                value: selectedItem.brand.name
              },
              {
                title: 'Unit Cost',
                value: 1170 // TODO: Calculate this later
              },
              {
                title: 'Available Qty.',
                value: selectedItem.quantity
              }
            ]}
          />
        )}
        <ModalActions mode={modal.mode}>
          {modal.mode === 'add' ? (
            <Button variant="primary" onClick={handleAddItem}>
              Add Item
            </Button>
          ) : (
            <>
              <Button variant="primary-v1" onClick={handleRemoveItem}>
                Remove
              </Button>
              <Button variant="primary" onClick={handleUpdateItem}>
                Update
              </Button>
            </>
          )}
        </ModalActions>
      </Modal>
      <div className="purchase-order-form">
        <FormActions title={mode === 'view' ? 'View PO' : 'Add PO'}>
          <Button onClick={() => goTo('/purchase-order')}>Go back</Button>
          {mode === 'add' && (
            <Button variant="primary" onClick={handleSubmit}>
              {mode === 'edit' ? 'Update PO' : 'Add PO'}
            </Button>
          )}
        </FormActions>
        <div className="purchase-order-form-container">
          <div className="purchase-order-form__group">
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
                  name="dateCreated"
                  label="Date Created"
                  component={DatePicker}
                />
                <InputGroup
                  name="supplier"
                  label="Supplier"
                  options={suppliers}
                  component={Select}
                  displayKey="initials"
                  error={safety(errors, 'supplier.id', 'Invalid supplier!')}
                />
              </>
            )}
          </div>
          <div className="purchase-order-form__group purchase-order-form__group--info">
            <MediumCard title="Grand Total" content="₱ 300,602.00" />
            <MediumCard title="Total Items" content="49" />
          </div>
        </div>
      </div>
      <div className="purchase-order-form__table">
        <Table
          local
          locked={mode === 'view'}
          title="Items to PO"
          icon="clipboard"
          headers={itemsHeaders}
          data={values.items}
          sortOptions={itemsSortOptions}
          onAdd={openAddModal}
          onRowClick={openUpdateModal}
        />
      </div>
    </Form>
  );
};

export default PurchaseOrderForm;
