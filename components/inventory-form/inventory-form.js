import { useState, useEffect } from 'react';
import { useFormikContext } from 'formik';
import omit from 'lodash.omit';
import useAppContext from 'js/contexts/app';
import { initialValues, variantsHeaders } from 'js/shapes/inventory';
import isObjectEmpty from 'js/utils/isObjectEmpty';
import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import codeCalc from 'js/utils/codeCalc';
import toMoney from 'js/utils/toMoney';
import FormActions from 'components/form-actions/form-actions';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import InputDisplay from 'components/input-display/input-display';
import InputSelectWithFetch from 'components/input-select-with-fetch/input-select-with-fetch';
import MultiSelectWithFetch from 'components/multi-select-with-fetch/multi-select-with-fetch';
import Button from 'components/button/button';
import TextArea from 'components/text-area/text-area';
import TableSelect from 'components/table-select/table-select';

// TODO: Create a seperate file for variant modal
import Modal from 'components/modal/modal';
import ModalActions from 'components/modal-actions/modal-actions';

const InventoryForm = ({ onSubmit, helpers }) => {
  const {
    setFieldValue,
    values,
    errors,
    setStatus,
    status,
    validateForm,
    isSubmitting
  } = useFormikContext();
  const { codes, notification } = useAppContext();

  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const { uoms, applications } = helpers;
  const { variantModal } = values;

  const handleSubmit = async () => {
    if (!status?.isSubmitted) {
      setStatus({ isSubmitted: true });
    }

    const newErrors = await validateForm(values);

    if (!isObjectEmpty(omit(newErrors, ['variantModal']))) return;

    onSubmit(
      omit(values, ['sizes', 'brands', 'suppliers', 'variants', 'variantModal'])
    );
  };

  const openVariantModal = () => setIsVariantModalOpen(true);

  const openEditVariantModal = (variant) => {
    setFieldValue('variantModal', variant);
    setIsVariantModalOpen(true);
  };

  const closeVariantModal = () => {
    setFieldValue('variantModal', initialValues.variantModal);
    setIsVariantModalOpen(false);
  };

  const updateVariant = async () => {
    try {
      const { data: updatedVariant } = await fetcher(
        `/inventory/${values.id}/variant/${variantModal.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(omit(variantModal, ['unitCost']))
        }
      );

      // update variant in list
      setFieldValue(
        'variants',
        values.variants.map((variant) =>
          variant.id === updatedVariant.id ? updatedVariant : variant
        )
      );

      notification.open({
        message: 'Updated variant!',
        variant: 'success'
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addVariant = async () => {
    try {
      const { variants } = await fetcher(`/inventory/${values.id}/variant`, {
        method: 'POST',
        body: JSON.stringify(omit(variantModal, ['unitCost']))
      });

      setFieldValue('variants', [
        {
          id: variants[0].id,
          ...variantModal
        },
        ...variants
      ]);

      closeVariantModal();
    } catch (error) {
      console.error(error);
    }
  };

  const onSaveVariantModal = () => {
    if ('id' in variantModal) {
      updateVariant();
    } else {
      addVariant();
    }
  };

  const onRemoveSelectedVariants = async (selectedVariants) => {
    if (values.variants.length <= 1) {
      notification.open({
        message: 'You need to at least have a minimum of 1 variant.',
        variant: 'danger'
      });

      return;
    }

    try {
      const { isSuccess } = await fetcher(`/inventory/${values.id}/variant`, {
        method: 'DELETE',
        body: JSON.stringify(selectedVariants)
      });

      if (isSuccess) {
        setFieldValue(
          'variants',
          values.variants.filter(
            // hmm..
            (variant) =>
              !selectedVariants.some(
                (selectedVariant) => selectedVariant.id === variant.id
              )
          )
        );
      }
    } catch (error) {
      console.error('Failed to remove variant/s');
    }
  };

  useEffect(() => {
    if (!status?.isSubmitted) return;
    const validate = async () => await validateForm(values);

    validate();
  }, [status, isSubmitting, values]); // maybe listen to required values only

  return (
    <div className="inventory-form">
      <FormActions icon="archive" title="Update item">
        <Button onClick={() => goTo('/inventory')}>Go back</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isObjectEmpty(omit(errors, ['variantModal']))}>
          Update item
        </Button>
      </FormActions>
      <div className="inventory-form-container inventory-form-container--top">
        <InputGroup name="particular" label="Particular" component={Input} />
        <InputGroup name="partsNumber" label="Parts Number" component={Input} />
        <InputGroup
          name="quantity"
          label="Quantity"
          type="number"
          component={Input}
        />
        <InputGroup
          name="applications"
          label="Applications"
          initialOptions={applications}
          serverRoute="/helpers/application"
          captureRemoved
          component={MultiSelectWithFetch}
        />
        <InputGroup
          name="uom"
          label="UOM"
          initialOptions={uoms}
          serverRoute="/helpers/uom"
          component={InputSelectWithFetch}
          error={safety(errors, 'uom.name', 'Invalid uom!')}
        />
        <InputGroup
          name="description"
          label="Description"
          component={TextArea}
        />
      </div>
      <div className="inventory-form-container inventory-form-container--table">
        <TableSelect
          title="Variants"
          headers={variantsHeaders}
          itemsKey="variants"
          onSubmit={onRemoveSelectedVariants}
          onAdd={openVariantModal}
          onRowClick={openEditVariantModal}
          submitButtonLabel="Remove selected variants"
        />
      </div>
      <Modal
        isOpen={isVariantModalOpen}
        title="Variant"
        closeModal={closeVariantModal}>
        <InputGroup
          name="variantModal.name"
          label="Variant Name"
          component={Input}
        />
        <InputGroup name="variantModal.codes" label="Codes" component={Input} />
        <InputGroup
          name="variantModal.codes"
          label="Unit Cost"
          component={InputDisplay}
          formatVal={(val) => `Php ${toMoney(codeCalc(codes, val))}`}
        />
        <InputGroup
          name="variantModal.srp"
          label="SRP (Suggested Retail Price)"
          type="number"
          component={Input}
        />
        <InputGroup
          name="variantModal.size"
          label="Size"
          serverRoute="/helpers/size"
          error={safety(errors, 'variantModal.size.name')}
          noIsNew
          component={InputSelectWithFetch}
        />
        <InputGroup
          name="variantModal.brand"
          label="Brand"
          serverRoute="/helpers/brand"
          error={safety(errors, 'variantModal.brand.name')}
          noIsNew
          component={InputSelectWithFetch}
        />
        <InputGroup
          name="variantModal.supplier"
          label="Supplier"
          serverRoute="/helpers/supplier"
          mainKey="initials"
          error={safety(errors, 'variantModal.supplier.initials')}
          noIsNew
          component={InputSelectWithFetch}
        />
        <ModalActions mode="single">
          <Button variant="primary" onClick={onSaveVariantModal}>
            Save
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
};

export default InventoryForm;
