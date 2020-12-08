import { useEffect, useState } from 'react';
import omit from 'lodash.omit';
import { useFormikContext } from 'formik';
import { initialValues } from 'js/shapes/stock-in';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import FormActions from 'components/form-actions/form-actions';
import FormSection from 'components/form-section/form-section';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import Button from 'components/button/button';
import DatePicker from 'components/date-picker/date-picker';
import TextArea from 'components/text-area/text-area';
import ProductsTable from './products-table';
import AddedItems from './added-items';
import AddToListModal from './add-to-list';
import CreateInventoryModal from './create-inventory';

const StockInForm = ({ onSubmit, mode = 'add', helpers }) => {
  // contexts
  const {
    values,
    errors,
    setFieldValue,
    validateForm,
    isSubmitting,
    status,
    setStatus
  } = useFormikContext();

  // states
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);

  // destructured
  const { suppliers, receivedBy, codedBy, checkedBy } = helpers;

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

  const openAddInventoryModal = () => setIsAddInventoryModalOpen(true);
  const closeAddInventoryModal = () => setIsAddInventoryModalOpen(false);

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

  const isSubmittable = (newErrors) =>
    isObjectEmpty(omit(newErrors, ['inventoryModal', 'listModal']));

  const handleSubmit = async () => {
    if (!status?.isSubmitted) {
      setStatus({ isSubmitted: true });
    }

    const newErrors = await validateForm(values);

    if (!isSubmittable(newErrors)) return;

    onSubmit(omit(values, 'inventoryModal', 'listModal'));
  };

  // NOTE: Eliminate this once you found a better & efficient alternive
  // Validate on change after submit
  useEffect(() => {
    if (!status?.isSubmitted) return;
    const validate = async () => await validateForm(values);

    validate();
  }, [status, isSubmitting, values]); // maybe listen to required values only

  return (
    <div className="stock-in-form">
      <FormActions
        icon="inbox"
        title={mode === 'edit' ? 'Update Stock In' : 'Create a Stock In'}>
        <Button onClick={() => goTo('/stock-in')}>Go back</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isSubmittable(errors)}>
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
            noIsNew
            component={InputSelectWithFetch}
          />
        </FormSection>
      </div>
      <ProductsTable
        onCreateProduct={openAddInventoryModal}
        onClickProduct={openAddToListModal}
      />
      {!!values.items.length && (
        <AddedItems onRemoveItems={removeSelectedItems} />
      )}
      <div className="stock-in-form-container">
        <FormSection title="Details">
          <InputGroup name="remarks" label="Remarks" component={TextArea} />
          <div className="stock-in__group stock-in__group--details">
            <InputGroup
              name="receivedBy"
              label="Received By"
              mainKey="receivedBy"
              serverRoute="/helpers/received-by"
              initialOptions={receivedBy}
              noIsNew
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="checkedBy"
              label="Checked By"
              mainKey="checkedBy"
              serverRoute="/helpers/checked-by"
              initialOptions={checkedBy}
              noIsNew
              component={InputSelectWithFetch}
            />
            <InputGroup
              name="codedBy"
              label="Coded By"
              mainKey="codedBy"
              serverRoute="/helpers/coded-by"
              initialOptions={codedBy}
              noIsNew
              component={InputSelectWithFetch}
            />
          </div>
        </FormSection>
      </div>
      <AddToListModal
        isOpen={isAddToListModalOpen}
        onClose={closeAddToListModal}
      />
      <CreateInventoryModal
        isOpen={isAddInventoryModalOpen}
        onClose={closeAddInventoryModal}
      />
    </div>
  );
};

export default StockInForm;
