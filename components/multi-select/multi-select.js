/* eslint
  jsx-a11y/no-static-element-interactions: off,
  jsx-a11y/click-events-have-key-events: off,
  jsx-a11y/interactive-supports-focus: off
*/

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import throttle from 'lodash.throttle';
import Icon from 'components/icon/icon';

const fakeApplications = [
  {
    id: 1,
    name: 'ISUZU 4BC2',
  },
  {
    id: 2,
    name: 'APX1',
  },
  {
    id: 3,
    name: '45A SINGLE PULLE',
  },
];

const fakeOptions = [
  {
    id: 1231,
    name: 'ISUZU 4BC3',
  },
  {
    id: 42,
    name: 'ISUZU 4BC4',
  },
  {
    id: 4343,
    name: 'ISUZU 4BC5',
  },
];

const MultiSelect = () => {
  const [values, setValues] = useState(fakeApplications);
  const [options, setOptions] = useState(fakeOptions);
  const [query, setQuery] = useState();
  const [isOpen, setIsOpen] = useState(false);

  // refs
  const input = useRef();

  // callbacks
  const closeDropdownListener = useCallback(throttle(() => {
    setIsOpen(false);
  }, 300), []);

  const handleOpen = () => {
    input.current.focus();
    setIsOpen(true);
  };

  const handleClose = () => {
    input.current.blur();
    setIsOpen(false);
  };

  const handleToggler = (e) => {
    e.stopPropagation();

    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const handleInput = (e) => {
    e.persist();

    setQuery(e.target.innerText);
  };

  const handleKeyPress = (e) => {
    // add item on enter
    if (e.type === 'keypress' && e.key !== 'Enter') return;

    addValue();
  };

  const removeValue = (e, id) => {
    e.stopPropagation();

    setValues((prevValues) => prevValues.filter((value) => value.id !== id));
  };

  const addValue = (e) => {
    if (!input.current.innerText) return;

    if (e) {
      e.stopPropagation();
    }

    input.current.innerHTML = null;

    setValues((prevValues) => ([
      ...prevValues,
      {
        id: prevValues.length + 1,
        name: query,
      },
    ]));
    setQuery(null);
  };

  const selectValue = (e, newValue) => {
    e.stopPropagation();

    setQuery('');
    setValues((prevValues) => prevValues.concat(newValue));
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdownListener);

    return () => window.removeEventListener('click', closeDropdownListener);
  }, []);

  useEffect(() => {
    setOptions((prevOptions) => prevOptions.reduce((newOptions, currentOption) => {
      const isExistsInValues = values.find((value) => currentOption.name === value.name);

      if (!isExistsInValues) {
        return newOptions.concat(currentOption);
      }

      return newOptions;
    }, []));
  }, [values]);

  return (
    <div className={`multi-select ${isOpen ? 'multi-select--open' : ''}`}>
      <div
        onClick={handleToggler}
        className="multi-select-group"
        type="button"
        role="button"
      >
        <div className="multi-select-values">
          {values.map((item) => (
            <button
              key={item.id}
              className="multi-select__value"
              type="button"
              onClick={(e) => removeValue(e, item.id)}
            >
              {item.name}
            </button>
          ))}
          <div
            ref={input}
            contentEditable
            className="multi-select__input"
            type="text"
            onInput={handleInput}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button
          className="multi-select__toggler"
          onClick={handleToggler}
          type="button"
        >
          <Icon icon="chevron-down" />
        </button>
      </div>
      <ul className="multi-select-list">
        {options.map((option, index) => (
          <li key={option.id} className="multi-select-list__item">
            <button
              className="multi-select-list__button"
              type="button"
              onClick={(e) => selectValue(e, option)}
            >
              <span>
                {index + 1}
                .
              </span>
              <span>{option.name}</span>
            </button>
          </li>
        ))}
        <li className="multi-select-list__item">
          <button
            className="multi-select-list__button multi-select-list__button--create"
            type="button"
            onClick={addValue}
          >
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
      </ul>
    </div>
  );
};

export default MultiSelect;
