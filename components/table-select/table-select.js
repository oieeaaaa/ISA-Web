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
  submitButtonLabel = 'Submit'
}) => {
  const [isSelectedAll, setIsSelectedAll] = useState(false);

  // custom hooks
  const { values, setFieldValue } = useFormikContext();

  // callbacks
  const isAllItemUnselect = useCallback(
    () => values[itemsKey].some((item) => !item.isSelected),
    [values[itemsKey]]
  );

  const isSomeItemSelected = useCallback(
    () => values[itemsKey].some((item) => item.isSelected),
    [values[itemsKey]]
  );

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

    onSubmit(allSelectedItems);
  };

  const tableSelectHeaders = [
    {
      customClass: 'table-select__checkbox-cell',
      customLabel: () => <Checkbox value={!isAllItemUnselect()} onClick={onSelectAllItem} />, // eslint-disable-line
      customCell: ({value}) => <Checkbox value={value.isSelected} onClick={() => onSelectItem(value)} />, // eslint-disable-line
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
      />
      {isSomeItemSelected() && (
        <Button
          className="table-select__submit"
          variant="primary"
          onClick={submitAllSelectedItem}>
          {submitButtonLabel}
        </Button>
      )}
    </div>
  );
};

export default TableSelect;
