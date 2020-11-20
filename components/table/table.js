import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Formik, useFormikContext, useField } from 'formik';
import debounce from 'lodash.debounce';
import { defaultLimits, defaultConfigs } from 'js/shapes/table';
import safety, { safeType } from 'js/utils/safety';
import Icon from 'components/icon/icon';
import Input from 'components/input/input';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';
import Button from 'components/button/button';

const TableWrapper = ({
  title,
  icon,
  renderFilter,
  filters,
  headers = [],
  data = [],
  sortOptions = [],
  onChange
}) => (
  <Formik
    initialValues={{
      ...defaultConfigs,
      ...safeType.object(filters)
    }}>
    <Table
      title={title}
      icon={icon}
      renderFilter={renderFilter}
      headers={headers}
      data={data}
      sortOptions={sortOptions}
      onChange={onChange}
    />
  </Formik>
);

const Table = ({
  title,
  icon,
  renderFilter,
  headers = [],
  data = [],
  sortOptions = [],
  onChange
}) => {
  // ref
  const advancedSearch = useRef();
  const advancedSearchContent = useRef();

  // state
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // custom hooks
  const { values } = useFormikContext();

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

  const onChangeListener = useCallback(debounce(() => onChange(values), 300));

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
    } else {
      advancedSearchEl.style.maxHeight = 0;
    }
  };

  /**
   * movePage.
   * isAdd true is moving 👉 way
   * isAdd false is moving 👈 way
   *
   * Updates the values.page
   */
  const movePage = (isAdd) => (e) => {
    e.preventDefault();

    // update page but with the min value set to 1
    pageHelpers.setValue(
      isAdd ? pageField.value + 1 : pageField.value - 1 || 1
    );
  };

  /**
   * flipDirection.
   * Set values.direction value to either asc or desc
   */
  const flipDirection = () => {
    directionHelpers.setValue(directionField.value === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    window.addEventListener('resize', windowResizeListener);

    return () => window.removeEventListener('resize', windowResizeListener);
  }, []);

  // trigger onChange prop if values changed
  useEffect(() => {
    if (!onChange) return;

    onChangeListener();
  }, [values]);

  return (
    <div
      className={`table ${
        isAdvancedSearchOpen ? 'table--advanced-search' : ''
      }`}>
      <div className="grid">
        <div className="table-header">
          <Icon icon={icon} />
          <h2 className="table-header__title">{title}</h2>
        </div>
        <div className="table-filter">
          <Input name="search" placeholder="Search item..." />
          <button
            className="table-filter__advanced"
            type="button"
            onClick={toggleAdvancedSearch}>
            Advanced
            <Icon icon="chevron-down" />
          </button>
        </div>
        <div
          className="table-advanced-search"
          ref={advancedSearch}
          aria-hidden={isAdvancedSearchOpen}>
          <div
            className="table-advanced-search__content"
            ref={advancedSearchContent}>
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
                className={`table-advanced-search__sort-button ${
                  values.direction === 'asc'
                    ? 'table-advanced-search__sort-button--asc'
                    : ''
                }`}
                variant="primary-v1"
                icon="arrow-up"
                onClick={flipDirection}
              />
            </div>
            {renderFilter && renderFilter()}
          </div>
        </div>
        <table className="table-container">
          <thead className="table__head">
            <tr>
              {headers.map((header) => (
                <th key={header.accessKey}>{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="table__body">
            {data.map((item) => (
              <tr key={item.id}>
                {headers.map(({ accessKey, customCell: Cell }) => {
                  const value = safety(item, accessKey, null);

                  return (
                    <td key={accessKey}>
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
          <div className="table-footer-pagination">
            <button
              className="table-footer-pagination__left"
              type="button"
              onClick={movePage(false)}>
              <Icon icon="chevron-down" />
            </button>
            <button
              className="table-footer-pagination__right"
              type="button"
              onClick={movePage(true)}>
              <Icon icon="chevron-down" />
            </button>
          </div>
        </div>
        <Link href="/inventory/add">
          <a className="table__add">
            <Button variant="primary-v1" icon="plus">
              Add Item
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default TableWrapper;
