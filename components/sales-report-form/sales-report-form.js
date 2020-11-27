import { useState } from 'react';
import { Form, useFormikContext } from 'formik';
import useAppContext from 'js/contexts/app';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import cssClassModifier from 'js/utils/cssClassModifier';
import {
  soldItemsHeaders,
  soldItemsSortOptions,
  initialValues
} from 'js/shapes/sales-report';
import Modal from 'components/modal/modal';
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

// TODO:
// Integrate the table ✅
// Setup table's props ✅
// Add Item Modal ✅
// Update Item Modal ✅
// Delete Item Modal ✅
// Styles ✅
// Fix table search, sort, limit ✅
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
    if (!isValid) return;

    onSubmit(values, { resetForm });
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setFieldValue('modal', initialValues.modal);
  };

  const closeModal = () => setIsModalOpen(false);

  const checkItemInSoldItems = () =>
    values.soldItems.some((si) => si.id === selectedItem.id);

  const openUpdateModal = (item) => {
    setIsModalOpen(true);

    setFieldValue('modal', {
      ...modal,
      mode: 'edit',
      selectedItem: item,
      selectedQuantity: item.selectedQuantity
    });
  };

  const handleAddItem = () => {
    if (checkItemInSoldItems()) {
      notification.open({
        message: 'Your item is already in the list',
        variant: 'danger',
        duration: 3000
      });

      return;
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
    if (!checkItemInSoldItems()) return;

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
    if (!checkItemInSoldItems()) return;

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
        <p className="sales-report-form-modal__info">
          {modal.mode === 'add'
            ? 'Add sales report for purchase order to display on this items list.'
            : 'Update item for sales report to display on this items list.'}
        </p>
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
        />
        {selectedItem.id && (
          <ul className="sales-report-form-modal__details">
            <li className="sales-report-form-modal__detail">
              <span className="sales-report-form-modal__detail-title">
                Supplier
              </span>
              <span className="sales-report-form-modal__detail-value">
                {selectedItem.supplier.initials}
              </span>
            </li>
            <li className="sales-report-form-modal__detail">
              <span className="sales-report-form-modal__detail-title">
                Brand
              </span>
              <span className="sales-report-form-modal__detail-value">
                {selectedItem.brand.name}
              </span>
            </li>
            <li className="sales-report-form-modal__detail">
              <span className="sales-report-form-modal__detail-title">
                Unit Cost
              </span>
              <span className="sales-report-form-modal__detail-value">
                1170 {/* TODO: Calculate this later */}
              </span>
            </li>
            <li className="sales-report-form-modal__detail">
              <span className="sales-report-form-modal__detail-title">
                Available Qty.
              </span>
              <span className="sales-report-form-modal__detail-value">
                {selectedItem.quantity - selectedQuantity}
              </span>
            </li>
          </ul>
        )}
        <div
          className={cssClassModifier(
            'sales-report-form-modal__actions',
            ['add'],
            [modal.mode === 'add']
          )}>
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
        </div>
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
