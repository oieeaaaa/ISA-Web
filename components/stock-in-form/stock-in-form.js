import { useState } from 'react';
import { useFormikContext } from 'formik';
import omitBy from 'lodash.omitby';
import set from 'lodash.set';
import fetcher from 'js/utils/fetcher';
import { initialValues, addedItemsHeaders } from 'js/shapes/stock-in';
import {
  tableHeaders,
  tableSortOptions,
  tableFilters
} from 'js/shapes/variant';
import safety from 'js/utils/safety';
import goTo from 'js/utils/goTo';
import toParam from 'js/utils/toParam';
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
import Modal from 'components/modal/modal';
import ModalInfoText from 'components/modal-info-text/modal-info-text';
import ModalInfoDetails from 'components/modal-info-details/modal-info-details';
import ModalActions from 'components/modal-actions/modal-actions';

const StockInForm = ({ mode = 'add', helpers, onSubmit }) => {
  const { values, errors, setFieldValue } = useFormikContext();

  const [tableData, setTableData] = useState({ items: [], totalItems: 0 });
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);

  const { suppliers, receivedBy, codedBy, checkedBy } = helpers;
  const { addToListModal } = values;

  const handleFetch = async ({
    limit,
    sortBy,
    direction,
    search,
    page,
    brand,
    size,
    supplier,
    inventory
  }) => {
    try {
      const param = toParam({
        search,
        ...omitBy(
          {
            direction,
            page,
            limit: limit.value,
            sortBy: sortBy.key,
            'brand.name': brand.name,
            'size.name': size.name,
            'supplier.initials': supplier.initials,
            'inventory.particular': inventory.particular
          },
          (val) => !val
        ) // omit falsy values
      });

      const url = `/helpers/variant?${param}`;
      const { data } = await fetcher(url);

      setTableData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const openAddToListModal = (product) => {
    if (checkIfProductExistInValues(product)) {
      setFieldValue('addToListModal', {
        data: product,
        quantity: safety(product, 'inventory.plusQuantity', 0)
      });
    } else {
      setFieldValue('addToListModal.data', product);
    }

    setIsAddToListModalOpen(true);
  };

  const closeAddToListModal = () => {
    setFieldValue('addToListModal', initialValues.addToListModal);
    setIsAddToListModalOpen(false);
  };

  const checkIfProductExistInValues = (product) =>
    values.items.some((item) => item.id === product.id);

  const handleQuantityChange = (e) => {
    const { value } = e.target;

    if (value !== '' && value <= 0) return;

    setFieldValue(e.target.name, value);
  };

  const handleItemToListSubmit = () => {
    const newItem = set(
      addToListModal.data,
      'inventory.plusQuantity',
      Number(addToListModal.quantity)
    );

    if (checkIfProductExistInValues(addToListModal.data)) {
      setFieldValue(
        'items',
        values.items.map((item) => {
          if (item.id === addToListModal.data.id) {
            return newItem;
          }

          return item;
        })
      );
    } else {
      setFieldValue('items', [newItem, ...values.items]);
    }

    setFieldValue('addToListModal', initialValues.addToListModal);
    closeAddToListModal();
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

  return (
    <div className="stock-in-form">
      <FormActions
        icon="inbox"
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
      </div>
      <div className="stock-in-form__table">
        <Table
          title="Products"
          icon="archive"
          headers={tableHeaders}
          filters={tableFilters}
          sortOptions={tableSortOptions}
          data={tableData.items}
          totalItems={tableData.totalItems}
          onChange={handleFetch}
          onRowClick={openAddToListModal}
          renderFilter={() => (
            <div className="stock-in-form__table-filters">
              <InputGroup
                name="supplier"
                label="Supplier"
                initialOptions={suppliers}
                mainKey="initials"
                serverRoute="/helpers/supplier"
                component={InputSelectWithFetch}
              />
              <InputGroup
                name="inventory"
                label="Particular"
                mainKey="particular"
                serverRoute="/helpers/inventory"
                component={InputSelectWithFetch}
              />
              <InputGroup
                name="size"
                label="Size"
                serverRoute="/helpers/size"
                component={InputSelectWithFetch}
              />
              <InputGroup
                name="brand"
                label="Brand"
                serverRoute="/helpers/brand"
                component={InputSelectWithFetch}
              />
            </div>
          )}
        />
      </div>
      <div className="stock-in-form-container">
        <TableSelect
          title="Added Items"
          headers={addedItemsHeaders}
          itemsKey="items"
          onSubmit={removeSelectedItems}
          submitButtonLabel="Remove Marked"
        />
      </div>
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
      <Modal
        title="Add to list"
        isOpen={isAddToListModalOpen}
        closeModal={closeAddToListModal}>
        <ModalInfoText>
          Before adding the item, please specify the quantity below.
        </ModalInfoText>
        <ModalInfoDetails
          details={[
            {
              title: 'Particular',
              value: safety(addToListModal, 'data.inventory.particular', '')
            },
            {
              title: 'Parts Number',
              value: safety(addToListModal, 'data.inventory.partsNumber', '')
            },
            {
              title: 'Variant Name',
              value: safety(addToListModal, 'data.name', '')
            },
            {
              title: 'Supplier',
              value: safety(addToListModal, 'data.supplier.initials', '')
            },
            {
              title: 'Brand',
              value: safety(addToListModal, 'data.brand.name', '')
            },
            {
              title: 'Size',
              value: safety(addToListModal, 'data.size.name', '')
            },
            {
              title: 'Unit Cost',
              value: safety(addToListModal, 'data.inventory.codes', '')
            },
            {
              title: 'Available Qty.',
              value:
                safety(addToListModal, 'data.inventory.quantity', 0) +
                Number(addToListModal.quantity)
            }
          ]}
        />
        {isAddToListModalOpen && (
          <InputGroup
            name="addToListModal.quantity"
            label="Quantity"
            type="number"
            onChange={handleQuantityChange}
            component={Input}
          />
        )}
        <ModalActions mode="add">
          <Button
            variant="primary"
            onClick={handleItemToListSubmit}
            disabled={!addToListModal.quantity}>
            Add Item
          </Button>
        </ModalActions>
      </Modal>
    </div>
  );
};

export default StockInForm;
