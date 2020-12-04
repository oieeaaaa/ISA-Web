import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Formik, useFormikContext, useField } from 'formik';
import debounce from 'lodash.debounce';
import orderBy from 'lodash.orderby';
import useAppContext from 'js/contexts/app';
import { defaultLimits, defaultConfigs } from 'js/shapes/table';
import cssClassModifier from 'js/utils/cssClassModifier';
import safety, { safeType } from 'js/utils/safety';
import Icon from 'components/icon/icon';
import InputGroup from 'components/input-group/input-group';
import Input from 'components/input/input';
import Select from 'components/select/select';
import Button from 'components/button/button';

// TODO: Table Date Picker is being cut-off
const TableWrapper = ({ filters, ...tableProps }) => (
  <Formik initialValues={{ ...defaultConfigs, ...safeType.object(filters) }}>
    <Table {...tableProps} />
  </Formik>
);

// TODO:
// Enable config persistency using url
// Simplify Add Item button
// Simplify Pagination
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
  local,
  locked
}) => {
  // ref
  const advancedSearch = useRef();
  const advancedSearchContent = useRef();

  // contexts
  const { notification } = useAppContext();

  // state
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // custom hooks
  const { values } = useFormikContext();
  const router = useRouter();

  // custom fields
  const [pageField, , pageHelpers] = useField('page');
  const [directionField, , directionHelpers] = useField('direction');

  // callbacks
  const windowResizeListener = useCallback(
    debounce(() => {
      const { current: advancedSearchEl } = advancedSearch;
      const { current: advancedSearchContentEl } = advancedSearchContent;

      // making sure that all required values exists
      const isGoodToResize =
        !isAdvancedSearchOpen || !advancedSearchEl || !advancedSearchContentEl;

      if (isGoodToResize) return;

      advancedSearchEl.style.maxHeight = `${advancedSearchContentEl.offsetHeight}px`;
    }, 300),
    [values]
  );

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
   * toggleAdvancedSearch.
   */
  const toggleAdvancedSearch = () => {
    const { current: advancedSearchEl } = advancedSearch;
    const { current: advancedSearchContentEl } = advancedSearchContent;

    const newAdvancedSearchState = !isAdvancedSearchOpen;

    setIsAdvancedSearchOpen(newAdvancedSearchState);

    // update height base on the content height of advance search
    if (newAdvancedSearchState) {
      advancedSearchEl.style.maxHeight = `${advancedSearchContentEl.offsetHeight}px`;

      // wait for it, then show it!
      setTimeout(() => {
        advancedSearchEl.style.overflow = 'unset';
      }, 300);
    } else {
      advancedSearchEl.style.maxHeight = 0;
      advancedSearchEl.style.overflow = 'hidden';
    }
  };

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
   * flipDirection.
   * Set values.direction value to either asc or desc
   */
  const flipDirection = () => {
    directionHelpers.setValue(directionField.value === 'asc' ? 'desc' : 'asc');
  };

  const handleRowClick = (item) => (e) => {
    e.preventDefault();

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

  const localSearch = (items) =>
    items.filter(
      (item) =>
        headers
          .map((th) => safeType.string(item[th.accessKey]).toLowerCase())
          .join(',')
          .search(values.search.toLowerCase()) !== -1
    );

  const localSort = (items) =>
    orderBy(items, [values.sortBy.key], [values.direction]);

  const localLimit = (items) => items.slice(0, values.limit.value);

  // TODO: Create a compose function
  const localData = () => localSearch(localSort(localLimit(data)));

  useEffect(() => {
    window.addEventListener('resize', windowResizeListener);

    return () => window.removeEventListener('resize', windowResizeListener);
  }, []);

  // trigger onChange prop if values changed
  useEffect(() => {
    if (!onChange) return;
    triggerOnChange(values);
  }, [values]);

  useEffect(() => {
    movePage(1); // move back to page 1 if the items changes
  }, [totalItems]);

  return (
    <div
      className={`table ${
        isAdvancedSearchOpen ? 'table--advanced-search' : ''
      }`}>
      <div className="table-header">
        <div className="table-heading">
          <Icon icon={icon} />
          <h2 className="table-heading__title">{title}</h2>
        </div>
        <div className="table-filter">
          <Input name="search" placeholder="Search here..." />
          <button
            className="table-filter__advanced"
            type="button"
            onClick={toggleAdvancedSearch}>
            Advanced
            <Icon icon="chevron-down" />
          </button>
        </div>
      </div>
      <div
        className="table-advanced-search"
        ref={advancedSearch}
        aria-hidden={isAdvancedSearchOpen}>
        <div
          className="table-advanced-search__content"
          ref={advancedSearchContent}>
          <div className="table-advanced-search__heading">
            <p className="table-advanced-search__text">Advanced Search</p>
            <div className="table-advanced-search__sort">
              <InputGroup
                name="sortBy"
                label="Sort by"
                options={sortOptions}
                component={Select}
                mainKey="key"
              />
              <Button
                className={cssClassModifier(
                  'table-advanced-search__sort-button',
                  ['desc'],
                  [values.direction === 'desc']
                )}
                variant="primary-v1"
                icon="arrow-up"
                onClick={flipDirection}
              />
            </div>
          </div>
          {renderFilter && !local && renderFilter()}
        </div>
      </div>
      <table className="table-container">
        <thead className="table__head">
          <tr>
            {headers.map((header) => (
              <th key={`${header.accessKey}--${header.label}`}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {(local ? localData() : data).map((item) => (
            <tr onClick={handleRowClick(item)} key={item.id}>
              {headers.map(({ label, accessKey, customCell: Cell }) => {
                const value = safety(item, accessKey, null);

                return (
                  <td key={`${accessKey}--${label}`}>
                    {Cell ? <Cell key={accessKey} value={value} /> : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <div className="table-footer-limit">
          <span className="table-footer-limit__text">Limit to</span>
          <Select
            id="limit"
            name="limit"
            options={defaultLimits}
            mainKey="value"
          />
        </div>
        {!local && (
          <div className="table-footer-pagination">
            <button
              className="table-footer-pagination__left"
              type="button"
              disabled={pageField.value === 1}
              onClick={() => movePage(pageField.value - 1)}>
              <Icon icon="chevron-down" />
            </button>
            <ul className="table-footer-pagination__numbers">
              {Array.from({ length: getTotalPages() }).map((_, index) => {
                const pageNum = index + 1;

                return (
                  <li key={index}>
                    <Button
                      className={cssClassModifier(
                        'table-footer-pagination__number',
                        ['active'],
                        [pageField.value === pageNum]
                      )}
                      onClick={() => movePage(pageNum)}>
                      {index + 1}
                    </Button>
                  </li>
                );
              })}
            </ul>
            <button
              className="table-footer-pagination__right"
              type="button"
              disabled={pageField.value === getTotalPages()}
              onClick={() => movePage(pageField.value + 1)}>
              <Icon icon="chevron-down" />
            </button>
          </div>
        )}
      </div>
      {!locked &&
        (onAdd ? (
          <Button
            className="table__add table__add-button"
            variant="primary-v1"
            onClick={onAdd}
            icon="plus">
            Add
          </Button>
        ) : (
          <Link href={`${router.pathname}/add`}>
            <a className="table__add table__add--link">
              <Button variant="primary-v1" icon="plus">
                Add
              </Button>
            </a>
          </Link>
        ))}
    </div>
  );
};

export default TableWrapper;
