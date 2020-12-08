import { useState } from 'react';
import { useFormikContext } from 'formik';
import useAppContext from 'js/contexts/app';
import omit from 'lodash.omit';
import { initialValues } from 'js/shapes/stock-in';
import fetcher from 'js/utils/fetcher';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import safety from 'js/utils/safety';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import Button from 'components/button/button';
import TextArea from 'components/text-area/text-area';
import Modal from 'components/modal/modal';
import ModalActions from 'components/modal-actions/modal-actions';

const CreateInventoryModal = ({ isOpen, onClose }) => {
  const {
    status,
    setStatus,
    setFieldValue,
    values,
    validateForm,
    errors
  } = useFormikContext();
  const { notification } = useAppContext();

  const [isPreSelected, setIsPreSelected] = useState(false);

  const { items, inventoryModal } = values;

  const handleQuantityChange = (e) => {
    const { value } = e.target;

    if (value !== '' && value <= 0) return;

    setFieldValue(e.target.name, value);
  };

  const addCreatedItemToItems = ({ inventoryID, variantID }) => {
    const { variant } = inventoryModal;

    setFieldValue('items', [
      {
        ...variant,
        id: variantID,
        inventory: {
          id: inventoryID,
          plusQuantity: Number(inventoryModal.quantity),
          particular: inventoryModal.particular.particular,
          partsNumber: inventoryModal.partsNumber.partsNumber
        }
      },
      ...items
    ]);
  };

  const addVariant = async () => {
    const { id, variant, quantity } = inventoryModal;

    try {
      const url = `/inventory/${id}/variant`;

      const { data } = await fetcher(url, {
        method: 'POST',
        body: JSON.stringify({
          ...variant,
          quantity
        })
      });

      addCreatedItemToItems({
        inventoryID: data.id,
        variantID: data.variants[0]?.id
      });

      notification.open({
        message: 'Added new inventory variant.',
        variant: 'success'
      });
    } catch (error) {
      notification.open({
        message:
          'Failed to add inventory variant, kindly double check your inputs and try again.',
        variant: 'danger'
      });
    }
  };

  const addInventoryItem = async () => {
    const { particular, partsNumber, variant, ...inventory } = inventoryModal;

    try {
      const { data } = await fetcher('/inventory', {
        method: 'POST',
        body: JSON.stringify({
          ...omit(inventory, ['id']),
          particular: particular.particular,
          partsNumber: partsNumber.partsNumber,
          variants: [variant]
        })
      });

      addCreatedItemToItems({
        inventoryID: data.id,
        variantID: data.variants[0]?.id
      });

      notification.open({
        message: 'Added new inventory item.',
        variant: 'success'
      });
    } catch (error) {
      notification.open({
        message:
          'Failed to add inventory item, kindly double check your inputs and try again.',
        variant: 'danger'
      });
    }
  };

  const handleAddInventoryItem = async () => {
    if (!status?.isSubmitted) {
      setStatus({ isSubmitted: true });
    }

    const newErrors = await validateForm(values);

    // if one of inventoryModal fields is invalid, stop this function from submitting.
    if (!isObjectEmpty(newErrors.inventoryModal)) return;

    try {
      if (isPreSelected) {
        await addVariant();
      } else {
        await addInventoryItem();
      }

      // reset form
      setFieldValue('inventoryModal', initialValues.inventoryModal);
      setIsPreSelected(false);
    } catch (error) {
      console.error(error);
    }

    // close modal
    onClose();
  };

  const onSelectExistingInventory = (val) => {
    const isExist = !!val.id;
    let newInventoryModal = {};

    if (isExist) {
      newInventoryModal = {
        ...inventoryModal,
        ...omit(val, [
          'dateCreated',
          'quantity',
          'sizes',
          'variants',
          'brands',
          'suppliers'
        ]),
        particular: {
          particular: val.particular
        },
        partsNumber: {
          partsNumber: val.partsNumber
        }
      };
    } else {
      newInventoryModal = omit(inventoryModal, ['id']);
    }

    setIsPreSelected(isExist);
    setFieldValue('inventoryModal', newInventoryModal);
  };

  const onChangePartciular = (value) => {
    if (value?.particular === inventoryModal.particular?.particular) return;

    // reset the inventory fields
    setFieldValue('inventoryModal', {
      ...inventoryModal,
      ...omit(initialValues.inventoryModal)
    });

    setIsPreSelected(false);
  };

  return (
    <Modal
      className="stock-in-form__inventory-modal"
      title="Create inventory item"
      isOpen={isOpen}
      closeModal={onClose}>
      <InputGroup
        name="inventoryModal.particular"
        label="Particular"
        mainKey="particular"
        serverRoute="/inventory"
        error={safety(errors, 'inventoryModal.particular.particular')}
        onSelect={onSelectExistingInventory}
        onChange={onChangePartciular}
        noIsNew
        component={InputSelectWithFetch}
      />
      <InputGroup
        name="inventoryModal.partsNumber"
        label="Parts Number"
        mainKey="partsNumber"
        serverRoute="/inventory"
        error={safety(errors, 'inventoryModal.partsNumber.partsNumber')}
        onSelect={onSelectExistingInventory}
        disabled={isPreSelected}
        noIsNew
        component={InputSelectWithFetch}
      />
      <InputGroup
        name="inventoryModal.uom"
        label="UOM (Unit of measurement)"
        serverRoute="/helpers/uom"
        error={safety(errors, 'inventoryModal.uom.name')}
        disabled={isPreSelected}
        noIsNew
        component={InputSelectWithFetch}
      />
      <InputGroup
        name="inventoryModal.codes"
        label="Codes"
        disabled={isPreSelected}
        component={Input}
      />
      <InputGroup
        name="inventoryModal.srp"
        label="SRP (Suggested retail price)"
        type="number"
        disabled={isPreSelected}
        component={Input}
      />
      <InputGroup
        name="inventoryModal.description"
        label="Description"
        disabled={isPreSelected}
        component={TextArea}
      />
      <InputGroup
        name="inventoryModal.applications"
        label="Applications"
        serverRoute="/helpers/application"
        disabled={isPreSelected}
        noIsNew
        component={MultiSelectWithFetch}
      />
      <InputGroup
        name="inventoryModal.variant.name"
        label="Variant Name"
        component={Input}
      />
      <InputGroup
        name="inventoryModal.variant.size"
        label="Size"
        serverRoute="/helpers/size"
        error={safety(errors, 'inventoryModal.variant.size.name')}
        noIsNew
        component={InputSelectWithFetch}
      />
      <InputGroup
        name="inventoryModal.variant.brand"
        label="Brand"
        serverRoute="/helpers/brand"
        error={safety(errors, 'inventoryModal.variant.brand.name')}
        noIsNew
        component={InputSelectWithFetch}
      />
      <InputGroup
        name="inventoryModal.variant.supplier"
        label="Supplier"
        serverRoute="/helpers/supplier"
        mainKey="initials"
        error={safety(errors, 'inventoryModal.variant.supplier.initials')}
        noIsNew
        component={InputSelectWithFetch}
      />
      <InputGroup
        name="inventoryModal.quantity"
        label="Quantity"
        type="number"
        onChange={handleQuantityChange}
        component={Input}
      />
      <ModalActions
        className="stock-in-form__inventory-modal__actions"
        mode="add">
        <Button variant="primary-v1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAddInventoryItem}
          disabled={!isObjectEmpty(errors.inventoryModal)}>
          Create new item
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default CreateInventoryModal;
