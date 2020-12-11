import { useFormikContext } from 'formik';
import set from 'lodash.set';
import { initialValues } from 'js/shapes/add-to-list-modal';
import safety from 'js/utils/safety';
import toMoney from 'js/utils/toMoney';
import Input from 'components/input/input';
import Button from 'components/button/button';
import InputGroup from 'components/input-group/input-group';
import Modal from 'components/modal/modal';
import ModalInfoText from 'components/modal-info-text/modal-info-text';
import ModalInfoDetails from 'components/modal-info-details/modal-info-details';
import ModalActions from 'components/modal-actions/modal-actions';

const AddToListModal = ({ isOpen, onClose }) => {
  const { values, setFieldValue } = useFormikContext();

  const { listModal } = values;

  const checkIfProductExistInValues = (product) =>
    values.items.some((item) => item.id === product.id);

  const handleQuantityChange = (e) => {
    const { value } = e.target;

    if (value !== '' && value <= 0) return;

    setFieldValue(e.target.name, value);
  };

  const handleItemToListSubmit = () => {
    const newItem = set(
      listModal.data,
      'inventory.plusQuantity',
      Number(listModal.quantity)
    );

    if (checkIfProductExistInValues(listModal.data)) {
      setFieldValue(
        'items',
        values.items.map((item) => {
          if (item.id === listModal.data.id) {
            return newItem;
          }

          return item;
        })
      );
    } else {
      setFieldValue('items', [newItem, ...values.items]);
    }

    setFieldValue('listModal', initialValues.listModal);
    onClose();
  };

  return (
    <Modal
      className="stock-in-form__add-to-list-modal"
      title="Add to list"
      isOpen={isOpen}
      closeModal={onClose}>
      <ModalInfoText>
        Before adding the item, please review and specify its quantity below.
      </ModalInfoText>
      <ModalInfoDetails
        details={[
          {
            title: 'Particular',
            value: safety(listModal, 'data.inventory.particular', '')
          },
          {
            title: 'Parts Number',
            value: safety(listModal, 'data.inventory.partsNumber', '')
          },
          {
            title: 'Variant Name',
            value: safety(listModal, 'data.name', '')
          },
          {
            title: 'Supplier',
            value: safety(listModal, 'data.supplier.initials', '')
          },
          {
            title: 'Brand',
            value: safety(listModal, 'data.brand.name', '')
          },
          {
            title: 'Size',
            value: safety(listModal, 'data.size.name', '')
          },
          {
            title: 'Unit Cost',
            value: `Php ${toMoney(safety(listModal, 'data.unitCost', 0))}`
          },
          {
            title: 'Quantity',
            value: safety(listModal, 'data.inventory.quantity', 0)
          }
        ]}
      />
      {isOpen && (
        <InputGroup
          name="listModal.quantity"
          label="Quantity"
          type="number"
          onChange={handleQuantityChange}
          value={listModal.quantity}
          component={Input}
        />
      )}
      <ModalActions mode="add">
        <Button
          variant="primary"
          onClick={handleItemToListSubmit}
          disabled={!listModal.quantity}>
          Add to list
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default AddToListModal;
