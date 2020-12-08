import { useState, useEffect, useCallback, useRef } from 'react';
import { useField } from 'formik';
import throttle from 'lodash.throttle';
import safety from 'js/utils/safety';
import joinClassName from 'js/utils/joinClassName';

const InputSelect = ({
  name,
  options = [],
  onSearch,
  onSelect,
  onChange,
  mainKey = 'name',
  noIsNew = false,
  ...etc
}) => {
  // refs
  const input = useRef();

  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // custom hooks
  const [field, , helpers] = useField({
    type: 'text',
    name
  });

  // callbacks
  const closeDropdownListener = useCallback(
    throttle((e) => {
      if (e.target !== input.current) {
        setIsDropdownOpen(false);
      }
    }, 300),
    []
  );

  const handleSearch = (e) => {
    const { value } = e.target;

    if (onSearch) {
      onSearch(value);
    }

    if (onChange) {
      onChange(value);
    }

    if (!value) return helpers.setValue({});

    const newValue = noIsNew
      ? {
          [mainKey]: value
        }
      : { [mainKey]: value, isNew: !options.length };

    helpers.setValue(newValue);
  };

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const selectValue = (selectedValue) => {
    if (onSelect) {
      onSelect(selectedValue);
    }

    helpers.setValue(selectedValue);
    setIsDropdownOpen(false);
  };

  const createValue = (newValue) => {
    const newCreateValue = noIsNew ? newValue : { ...newValue, isNew: true };

    selectValue(newCreateValue);
  };

  // auto select option if exact match
  useEffect(() => {
    const valueInOptions = options.find(
      (option) => option[mainKey] === field.value[mainKey]
    );

    if (valueInOptions) {
      selectValue(valueInOptions);
    }
  }, [field.value[mainKey]]);

  // on component load
  useEffect(() => {
    window.addEventListener('click', closeDropdownListener);

    return () => window.removeEventListener('click', closeDropdownListener);
  }, []);

  // TODO: A lot of things here are wrong, fix it JOIMEE!
  return (
    <div className="input-select">
      <input
        ref={input}
        className="input-select__input"
        onFocus={handleDropdownOpen}
        onChange={handleSearch}
        onBlur={field.onBlur}
        value={safety(field, 'value', {})[mainKey]}
        autoComplete="off"
        {...etc}
      />
      {isDropdownOpen && (
        <ul className="input-select__list">
          {options.map((option, index) => (
            <li className="input-select__item" key={option[mainKey]}>
              <button
                className={joinClassName(
                  'input-select__button',
                  option[mainKey] === safety(field, 'value', {})[mainKey] &&
                    'input-select__button--active'
                )}
                type="button"
                onClick={() => selectValue(option)}>
                <span className="input-select__button-index">{index + 1}.</span>
                <span>{option[mainKey]}</span>
              </button>
            </li>
          ))}
          {options && !options.length && (
            <li className="input-select__item">
              <button
                className="input-select__button"
                type="button"
                onClick={() =>
                  createValue({
                    [mainKey]: safety(field, 'value', {})[mainKey]
                  })
                }>
                <span className="input-select__button-text">
                  {`${
                    safety(field, 'value', {})[mainKey]
                      ? `"${safety(field, 'value', {})[mainKey]}"`
                      : 'Empty'
                  }`}
                </span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default InputSelect;
