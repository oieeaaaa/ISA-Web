import { useState } from 'react';
import { Form, useFormikContext } from 'formik';

// contexts
import useAppContext from 'js/contexts/app';

// utils
import safety, { safeType } from 'js/utils/safety';
import goTo from 'js/utils/goTo';

// shapes
import {
  soldItemsHeaders,
  soldItemsSortOptions,
  initialValues
} from 'js/shapes/sales-report';

// components
import Modal from 'components/modal/modal';
import ModalInfoText from 'components/modal-info-text/modal-info-text';
import ModalInfoDetails from 'components/modal-info-details/modal-info-details';
import ModalActions from 'components/modal-actions/modal-actions';
import FormActions from 'components/form-actions/form-actions';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import MultiInput from 'components/multi-input/multi-input';
import MediumCard from 'components/medium-card/medium-card';
import Table from 'components/table/table';

const SalesReportForm = ({ mode = 'add', helpers, onSubmit }) => {
  // contexts
  const {
    values,
    errors,
    isValid,
    resetForm,
    setFieldValue
  } = useFormikContext();
  const { notification } = useAppContext();

  // state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // vars
  const { inventory, banks, salesTypes, paymentTypes } = helpers;

  const { modal } = values;
  const { selectedItem, selectedQuantity } = modal;

  const handleSubmit = () => {
    if (errors.soldItems) {
      notification.open({
        message: 'Sold Items is required!',
        variant: 'danger'
      });
    }

    if (!isValid) return;

    onSubmit(values, { resetForm });
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setFieldValue('modal', initialValues.modal);
  };

  const closeModal = () => setIsModalOpen(false);

  const isItemInSoldItems = values.soldItems.some(
    (si) => si.id === selectedItem.id
  );

  const isItemInRemovedItems = values.removedItems.some(
    ({ id }) => id === selectedItem.id
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

    if (isItemInRemovedItems) {
      setFieldValue(
        'removedItems',
        values.removedItems.filter(({ id }) => id !== selectedItem.id)
      );
    }

    // add new item to soldItems
    setFieldValue(
      'soldItems',
      values.soldItems.concat({
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
      'soldItems',
      // we only need to update the selectedQuantity, so I'm doing this
      values.soldItems.map((si) =>
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

    if (mode === 'edit') {
      setFieldValue(
        'removedItems',
        values.removedItems.concat({
          id: selectedItem.soldItemID,
          itemID: selectedItem.id,
          quantity: selectedItem.selectedQuantity
        })
      );
    }

    setFieldValue(
      'soldItems',
      values.soldItems.filter((si) => si.id !== selectedItem.id)
    );

    setFieldValue('modal', initialValues.modal);

    closeModal();
  };

  return (
    <Form>
      <Modal
        title={modal.mode === 'add' ? 'Add Item' : 'Update Item'}
        isOpen={isModalOpen}
        closeModal={closeModal}>
        <ModalInfoText>
          {modal.mode === 'add'
            ? 'Add sales report for purchase order to display on this items list.'
            : 'Update item for sales report to display on this items list.'}
        </ModalInfoText>
        <InputGroup
          name="modal.selectedItem"
          label="Your item"
          initialOptions={inventory}
          serverRoute="/helpers/inventory"
          component={InputSelectWithFetch}
          mainKey="particular"
          error={safety(errors, 'soldItem.data.id', 'Invalid Item!')}
          takeWhole
          disabled={modal.mode === 'edit'}
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
                value:
                  selectedItem.quantity -
                  (selectedQuantity - safeType.number(selectedItem.prevQty))
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
              {values.type.name.toLowerCase() === 'account' ? (
                <>
                  <InputGroup
                    name="drNumber"
                    label="DR Number"
                    component={Input}
                  />
                  <InputGroup
                    name="crsNumber"
                    label="CRS Number"
                    component={Input}
                  />
                </>
              ) : (
                <>
                  <InputGroup name="tin" label="Tin" component={Input} />
                  <InputGroup
                    name="siNumber"
                    label="SI Number"
                    component={Input}
                  />
                  <InputGroup
                    name="arsNumber"
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
                component={MultiInput}
                mainKey="name"
              />
            </div>
          </FormSection>
          <FormSection title="Payment">
            {values.type.name.toLowerCase() === 'account' ? (
              <InputGroup
                name="discount"
                label="Discount"
                type="number"
                component={Input}
              />
            ) : (
              <>
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
                {safety(values, 'paymentType.name', '').toLowerCase() ===
                'cheque' ? (
                  <>
                    <InputGroup
                      name="bank"
                      label="Bank"
                      initialOptions={banks}
                      serverRoute="/helpers/bank"
                      component={InputSelectWithFetch}
                      error={safety(errors, 'bank.id', 'Invalid bank!')}
                    />
                    <InputGroup
                      name="chequeNumber"
                      label="Number"
                      component={Input}
                    />
                    <InputGroup
                      name="chequeDate"
                      label="Date"
                      component={DatePicker}
                    />
                  </>
                ) : (
                  <InputGroup
                    name="amount"
                    label="Amount"
                    type="number"
                    component={Input}
                  />
                )}
              </>
            )}
          </FormSection>
          <div className="sales-report-form__pricing-info">
            <MediumCard title="Gross Sales" content="₱20,602.00" />
            <MediumCard title="Net Sales" content="₱20,102.00" />
            <MediumCard title="Discounts" content="₱500" />
          </div>
        </div>
      </div>
      <div className="sales-report-form__table">
        <Table
          local
          title="Sold Items"
          icon="clipboard"
          headers={soldItemsHeaders}
          data={values.soldItems}
          sortOptions={soldItemsSortOptions}
          onAdd={openAddModal}
          onRowClick={openUpdateModal}
        />
      </div>
    </Form>
  );
};

export default SalesReportForm;
