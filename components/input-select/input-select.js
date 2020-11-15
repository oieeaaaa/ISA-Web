import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useField } from 'formik';
import throttle from 'lodash.throttle';

const InputSelect = ({ id, options, ...etc }) => {
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
        {...field}
        ref={input}
        id={id}
        className="input-select__input"
        onFocus={handleDropdownOpen}
        autoComplete="off"
      />
      {isDropdownOpen && (
        <ul className="input-select__list">
          {options.map((option, index) => (
            <li className="input-select__item" key={option.id}>
              <button
                className="input-select__button"
                type="button"
                onClick={() => selectValue(option.name)}
              >
                <span>
                  {index + 1}
                  .
                </span>
                <span>{option.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InputSelect;
