import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import Link from 'next/link';
import { Formik, useFormikContext } from 'formik';
import throttle from 'lodash.throttle';
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
  onChange,
}) => (
  <Formik initialValues={{
    ...defaultConfigs,
    ...safeType.object(filters),
  }}
  >
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
  onChange,
}) => {
  // ref
  const advancedSearch = useRef();
  const advancedSearchContent = useRef();

  // state
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // custom hooks
  const { values } = useFormikContext();

  // callbacks
  const windowResizeListener = useCallback(throttle(() => {
    const { current: advancedSearchEl } = advancedSearch;
    const { current: advancedSearchContentEl } = advancedSearchContent;

    if (!isAdvancedSearchOpen || !advancedSearchEl || !advancedSearchContentEl) return;

    advancedSearchEl.style.maxHeight = `${advancedSearchContentEl.offsetHeight}px`;
  }, 300));

  const toggleAdvancedSearch = () => {
    const { current: advancedSearchEl } = advancedSearch;
    const { current: advancedSearchContentEl } = advancedSearchContent;

    const advancedSearchState = !isAdvancedSearchOpen;

    setIsAdvancedSearchOpen(advancedSearchState);

    if (advancedSearchState) {
      advancedSearchEl.style.maxHeight = `${advancedSearchContentEl.offsetHeight}px`;
    } else {
      advancedSearchEl.style.maxHeight = 0;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', windowResizeListener);

    return () => window.removeEventListener('resize', windowResizeListener);
  }, []);

  useEffect(() => {
    if (!onChange) return;

    onChange(values);
  }, [values]);

  return (
    <div className={`table ${isAdvancedSearchOpen ? 'table--advanced-search' : ''}`}>
      <div className="grid">
        <div className="table-header">
          <Icon icon={icon} />
          <h2 className="table-header__title">{title}</h2>
        </div>
        <div className="table-filter">
          <Input
            name="search"
            placeholder="Search item..."
          />
          <button
            className="table-filter__advanced"
            type="button"
            onClick={toggleAdvancedSearch}
          >
            Advanced
            <Icon icon="chevron-down" />
          </button>
        </div>
        <div
          className="table-advanced-search"
          ref={advancedSearch}
          aria-hidden={isAdvancedSearchOpen}
        >
          <div className="table-advanced-search__content" ref={advancedSearchContent}>
            <p className="table-advanced-search__text">Advanced Search</p>
            <div className="table-advanced-search__sort">
              <InputGroup
                name="sort"
                label="Sort by"
                options={sortOptions}
                component={Select}
              />
              <Button
                className="table-advanced-search__sort-button"
                variant="primary-v1"
                icon="arrow-up"
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
            <button className="table-footer-pagination__left" type="button">
              <Icon icon="chevron-down" />
            </button>
            <button className="table-footer-pagination__right" type="button">
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
