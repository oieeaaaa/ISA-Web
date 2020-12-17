import { useState, useCallback } from 'react';
import { useFormikContext } from 'formik';
import FormSectionTitle from 'components/form-section-title/form-section-title';
import TableContainer from 'components/table/table-container';
import Checkbox from 'components/checkbox/checkbox';
import Button from 'components/button/button';

const TableSelect = ({
  title,
  headers,
  onSubmit,
  itemsKey,
  submitButtonLabel = 'Submit',
  addButtonLabel = 'Add new',
  onAdd,
  ...etc
}) => {
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // custom hooks
  const { values, setFieldValue } = useFormikContext();

  // callbacks
  const isSomeItemSelected = useCallback(
    () => values[itemsKey].some((item) => item.isSelected),
    [values[itemsKey]]
  );

  // the order matters: update the items first -> check if isAllItemsSelected -> then set state
  const onSelectItem = (itemToSelect) => {
    setFieldValue(
      itemsKey,
      values[itemsKey].map((item) => {
        if (item.id === itemToSelect.id) {
          item.isSelected = !item.isSelected;
        }

        return item;
      })
    );

    const isAllItemsSelected = !values[itemsKey].some(
      (item) => !item.isSelected
    );

    setIsSelectedAll(isAllItemsSelected);
  };

  const onSelectAllItem = () => {
    setFieldValue(
      itemsKey,
      values[itemsKey].map((item) => ({
        ...item,
        isSelected: !isSelectedAll
      }))
    );

    setIsSelectedAll((prevIsSelectedAll) => !prevIsSelectedAll);
  };

  const submitAllSelectedItem = () => {
    const allSelectedItems = values[itemsKey].filter((item) => item.isSelected);

    onSubmit(allSelectedItems, isSelectedAll);

    setIsSelectedAll(false);
  };

  const tableSelectHeaders = [
    {
      customClass: 'table-select__checkbox-cell',
      customLabel: () => (
        <Checkbox value={isSelectedAll} onClick={onSelectAllItem} />
      ), // eslint-disable-line
      customCell: ({ value }) => (
        <Checkbox
          value={value.isSelected}
          onClick={(e) => {
            e.stopPropagation(); // prevent trigger if table row have click events
            onSelectItem(value);
          }}
        />
      ) // eslint-disable-line
    },
    ...headers
  ];

  return (
    <div className="table-select">
      <FormSectionTitle className="table-select__title" title={title} />
      <TableContainer
        className="table-select__table"
        headers={tableSelectHeaders}
        data={values[itemsKey]}
        {...etc}
      />
      <div className="table-select__actions">
        {isSomeItemSelected() && (
          <Button
            className="table-select__submit"
            variant="danger"
            onClick={submitAllSelectedItem}>
            {submitButtonLabel}
          </Button>
        )}
        {onAdd && (
          <Button
            variant="primary"
            icon="plus"
            className="table-select__add"
            onClick={onAdd}>
            {addButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableSelect;
