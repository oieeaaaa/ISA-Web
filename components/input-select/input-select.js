import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useField } from 'formik';
import throttle from 'lodash.throttle';
import joinClassName from 'js/utils/joinClassName';

const InputSelect = ({
  id,
  options,
  onSearch,
  accessKey = 'name',
  ...etc
}) => {
  // refs
  const input = useRef();

  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // callbacks
  const closeDropdownListener = useCallback(throttle((e) => {
    if (e.target !== input.current) {
      setIsDropdownOpen(false);
    }
  }, 300), []);

  // custom hooks
  const [field, , helpers] = useField({ type: 'text', ...etc });

  const handleSearch = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }

    helpers.setValue({ [accessKey]: e.target.value });
  };

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const selectValue = (selectedValue) => {
    helpers.setValue(selectedValue, false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdownListener);

    return () => window.removeEventListener('click', closeDropdownListener);
  }, []);

  return (
    <div className="input-select">
      <input
        ref={input}
        id={id}
        className="input-select__input"
        onFocus={handleDropdownOpen}
        onChange={handleSearch}
        onBlur={field.onBlur}
        value={field.value[accessKey]}
        autoComplete="off"
      />
      {isDropdownOpen && (
        <ul className="input-select__list">
          {options.map((option, index) => (
            <li className="input-select__item" key={option[accessKey]}>
              <button
                className={joinClassName('input-select__button', option[accessKey] === field.value[accessKey] && 'input-select__button--active')}
                type="button"
                onClick={() => selectValue({ [accessKey]: option[accessKey] })}
              >
                <span className="input-select__button-index">
                  {index + 1}
                  .
                </span>
                <span>{option[accessKey]}</span>
              </button>
            </li>
          ))}
          {(options && !options.length) && (
            <li className="input-select__item">
              <button
                className="input-select__button"
                type="button"
                onClick={() => selectValue(field.value[accessKey])}
              >
                <span className="input-select__button-text">
                  Adding
                  {' '}
                  {`"${field.value[accessKey]}"`}
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
