import { useEffect, useCallback, useState, useRef } from 'react';
import { useFormikContext, useField } from 'formik';
import debounce from 'lodash.debounce';
import cssClassModifier from 'js/utils/cssClassModifier';
import Icon from 'components/icon/icon';
import Input from 'components/input/input';
import InputGroup from 'components/input-group/input-group';
import Select from 'components/select/select';
import Button from 'components/button/button';

const TableHeader = ({ title, icon, sortOptions, renderFilter }) => {
  // contexts
  const { values } = useFormikContext();

  // refs
  const advancedSearch = useRef();
  const advancedSearchContent = useRef();

  // states
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // custom hooks
  const [directionField, , directionHelpers] = useField('direction');

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

  const windowResizeListener = useCallback(
    debounce(() => {
      const { current: advancedSearchEl } = advancedSearch;
      const { current: advancedSearchContentEl } = advancedSearchContent;

      // making sure that all required values exists
      const isMissingRequiredVars =
        !isAdvancedSearchOpen || !advancedSearchEl || !advancedSearchContentEl;

      if (isMissingRequiredVars) return;

      advancedSearchEl.style.maxHeight = `${advancedSearchContentEl.offsetHeight}px`;
    }, 300),
    [values]
  );

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

  return (
    <div>
      <div
        className={cssClassModifier(
          'table-header',
          ['active'],
          [isAdvancedSearchOpen]
        )}>
        <div className="table-heading">
          {icon && <Icon icon={icon} />}
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
          {renderFilter && renderFilter()}
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
