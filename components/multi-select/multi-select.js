/* eslint
  jsx-a11y/no-static-element-interactions: off,
  jsx-a11y/click-events-have-key-events: off,
  jsx-a11y/interactive-supports-focus: off
*/

import { useState, useRef, useEffect, useCallback } from 'react';
import { useFormikContext, useField } from 'formik';
import throttle from 'lodash.throttle';
import cssClassModifier from 'js/utils/cssClassModifier';
import safety, { safeType } from 'js/utils/safety';
import Icon from 'components/icon/icon';

const MultiSelect = ({
  name,
  mainKey = 'name',
  options = [],
  onSearch,
  noCreate,
  captureRemoved,
  disabled,
  noIsNew,
  ...etc
}) => {
  // contexts
  const { values, setFieldValue } = useFormikContext();

  // states
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // refs
  const multiSelectValues = useRef();
  const input = useRef();

  // callbacks
  const closeDropdownListener = useCallback(
    throttle((e) => {
      if (e.target !== multiSelectValues.current) {
        setIsOpen(false);
      }
    }, 300),
    []
  );

  // custom hooks
  const [field, , helpers] = useField({
    name,
    multiple: true
  });

  // my vars, yo!
  const removedValuesName = `${name}X`;

  const handleOpen = () => {
    input.current.focus();
    setIsOpen(true);
  };

  const handleClose = () => {
    input.current.blur();
    setIsOpen(false);
  };

  const handleToggler = () => {
    if (disabled) return;

    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const updateQuery = (val) => {
    if (onSearch) {
      onSearch(val);
    }

    setQuery(val);
  };

  const handleInput = (e) => {
    e.persist();

    updateQuery(e.target.value);
  };

  // TODO: Fix auto-submit form on enter
  const handleKeyPress = (e) => {
    e.persist();

    // add item on enter
    if (e.type === 'keypress' && !e.ctrlKey && e.key !== 'Enter') return;

    // only allow create if noCreate is false
    if (!noCreate) {
      createNewValue();
    }

    setQuery('');
  };

  // prevent duplicates
  const isInRemovedValues = (item) =>
    safeType
      .array(values[removedValuesName])
      .some((removedValue) => removedValue[mainKey] === item[mainKey]);

  const captureRemovedValue = (itemToRemove) => {
    if (!captureRemoved) return;

    if (isInRemovedValues(itemToRemove)) return;

    setFieldValue(
      removedValuesName,
      safeType.array(values[removedValuesName]).concat(itemToRemove)
    );
  };

  const putBackRemovedValue = (itemToPutBack) => {
    if (!captureRemoved) return;

    if (!isInRemovedValues(itemToPutBack)) return;

    setFieldValue(
      removedValuesName,
      safeType
        .array(values[removedValuesName])
        .filter((rv) => rv[mainKey] !== itemToPutBack[mainKey])
    );
  };

  const removeValue = (e, itemToRemove) => {
    if (disabled) return;

    e.stopPropagation();

    helpers.setValue(
      field.value.filter((value) => value[mainKey] !== itemToRemove[mainKey])
    );

    captureRemovedValue(itemToRemove);
  };

  const createNewValue = () => {
    const isInValue = field.value.some((val) => val[mainKey] === query);

    if (!query || isInValue) return;

    const isInOptions = safeType
      .array(options)
      .some((option) => option[mainKey] === query);

    let value = {
      name: query
    };

    if (!isInOptions && !noIsNew) {
      value = {
        ...value,
        isNew: true
      };
    }

    helpers.setValue([...field.value, value]);

    updateQuery('');
  };

  const selectValue = (e, value) => {
    if (e) {
      e.stopPropagation();
    }

    // update value
    const newValue = field.value.concat(value);
    helpers.setValue(newValue);

    // clear input
    updateQuery('');

    // put back
    putBackRemovedValue(value);

    input.current.focus();
  };

  const isOptionNew = !safeType
    .array(options)
    .some((option) => option[mainKey] === query);

  const availableOptions = safeType
    .array(options)
    .filter(
      (option) =>
        !safety(field, 'value', []).some(
          (value) => value[mainKey] === option[mainKey]
        )
    );

  const isEmpty = !availableOptions.length;

  useEffect(() => {
    window.addEventListener('click', closeDropdownListener);

    return () => window.removeEventListener('click', closeDropdownListener);
  }, []);

  // auto select option if exact match
  useEffect(() => {
    const valueInOptions = options.find((option) => option[mainKey] === query);

    if (valueInOptions) {
      selectValue(null, valueInOptions);
    }
  }, [field.value, query]);

  return (
    <div
      className={cssClassModifier(
        'multi-select',
        ['open', 'disabled'],
        [isOpen, disabled]
      )}>
      <div
        onClick={handleToggler}
        className="multi-select-group"
        type="button"
        role="button">
        <div ref={multiSelectValues} className="multi-select-values">
          {safety(field, 'value', []).map((value) => (
            <button
              key={value[mainKey]}
              className="multi-select__value"
              type="button"
              onClick={(e) => removeValue(e, value)}>
              {value[mainKey]}
            </button>
          ))}
          <input
            {...etc}
            ref={input}
            className="multi-select__input"
            type="text"
            onKeyPress={handleKeyPress}
            onChange={handleInput}
            onBlur={field.onBlur}
            value={query}
            size={query.length || 1}
            disabled={disabled}
          />
        </div>
        <Icon className="multi-select__toggler" icon="chevron-down" />
      </div>
      <ul className="multi-select-list">
        {availableOptions.map((option, index) => (
          <li key={option[mainKey]} className="multi-select-list__item">
            <button
              className="multi-select-list__button"
              type="button"
              onClick={(e) => selectValue(e, option)}>
              <span>{index + 1}.</span>
              <span>{option[mainKey]}</span>
            </button>
          </li>
        ))}
        {!noCreate && isOptionNew && (
          <li className="multi-select-list__item">
            <button
              className="multi-select-list__button multi-select-list__button--create"
              type="button"
              onClick={createNewValue}>
              <span>
                <Icon icon="plus" />
              </span>
              <span>
                Create as &rdquo;
                {query}
                &rdquo;
              </span>
            </button>
          </li>
        )}
        {isEmpty && noCreate && (
          <li
            className={cssClassModifier(
              'multi-select-list__item',
              ['empty'],
              [true]
            )}>
            <p className="multi-select-list__text">There is nothing here.</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MultiSelect;
