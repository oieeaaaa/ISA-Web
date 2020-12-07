import { addedItemsHeaders } from 'js/shapes/stock-in';
import TableSelect from 'components/table-select/table-select';

const AddedItems = ({ onRemoveItems }) => (
  <div className="stock-in-form-container">
    <TableSelect
      title="Added Items"
      headers={addedItemsHeaders}
      itemsKey="items"
      onSubmit={onRemoveItems}
      submitButtonLabel="Remove Marked"
    />
  </div>
);

export default AddedItems;
