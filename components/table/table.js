import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Formik, useFormikContext, useField } from 'formik';
import debounce from 'lodash.debounce';
import useAppContext from 'js/contexts/app';
import { defaultConfigs } from 'js/shapes/table';
import { safeType } from 'js/utils/safety';
import Button from 'components/button/button';
import TableHeader from './table-header';
import TableContainer from './table-container';
import TableFooter from './table-footer';

const TableWrapper = ({ filters, ...tableProps }) => (
  <Formik initialValues={{ ...defaultConfigs, ...safeType.object(filters) }}>
    <Table {...tableProps} />
  </Formik>
);

// TODO:
// Enable config persistency using url
// Date Picker is getting cut-off
const Table = ({
  title,
  icon,
  renderFilter,
  headers = [],
  data = [],
  sortOptions = [],
  totalItems,
  onChange,
  onAdd,
  onRowClick,
  locked
}) => {
  // contexts
  const { notification } = useAppContext();

  // custom hooks
  const { values } = useFormikContext();
  const router = useRouter();

  // custom fields
  const [pageField, , pageHelpers] = useField('page');

  // callbacks
  const triggerOnChange = useCallback(
    debounce(() => {
      onChange(values);
    }, 300),
    [values]
  );

  const getTotalPages = useCallback(() => {
    const totalPages = Math.round(totalItems / values.limit.value);

    if (totalPages === Infinity || totalPages <= 0) return 1;

    return totalPages;
  }, [data]);

  /**
   * movePage.
   *
   * Updates the values.page
   */
  const movePage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > getTotalPages()) return;

    pageHelpers.setValue(pageNumber);
  };

  /**
   * handleRowClick.
   *
   * @param {object} item
   */
  const handleRowClick = (item) => {
    if (locked) {
      notification.open({
        message: 'This row is locked.',
        variant: 'danger'
      });

      return;
    }

    if (onRowClick) return onRowClick(item);

    const { pathname, push } = router;

    // visit the item's page
    push(`${pathname}/${item.id}`);
  };

  // trigger onChange prop if values changed
  useEffect(() => {
    if (!onChange) return;
    triggerOnChange(values);
  }, [values]);

  useEffect(() => {
    movePage(1); // move back to page 1 if the items changes
  }, [totalItems]);

  return (
    <div className="table">
      <TableHeader
        title={title}
        icon={icon}
        sortOptions={sortOptions}
        renderFilter={renderFilter}
      />
      <TableContainer
        headers={headers}
        data={data}
        onRowClick={handleRowClick}
      />
      <TableFooter
        totalPages={getTotalPages()}
        currentPage={pageField.value}
        onPageChange={movePage}
      />
      {onAdd && (
        <Button
          className="table__add table__add-button"
          variant="primary-v1"
          onClick={onAdd}
          icon="plus">
          Create new
        </Button>
      )}
    </div>
  );
};

export default TableWrapper;
