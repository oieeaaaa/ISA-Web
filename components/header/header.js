import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import cssClassModifier from 'js/utils/cssClassModifier';
import Icon from 'components/icon/icon';

// TODO: Menu, Accessbility, Desktop
const Header = () => {
  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // callbacks
  const hideDropdown = useCallback(
    debounce(() => {
      setIsDropdownOpen(false);
    }, 100),
    []
  );

  const scrollListener = useCallback(
    throttle(() => {
      const triggerOffset = 50;

      if (window.scrollY >= triggerOffset) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, 250),
    []
  );

  const toggleDropdown = (e) => {
    e.stopPropagation();

    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    window.addEventListener('click', hideDropdown);
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('click', hideDropdown);
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  return (
    <div className={cssClassModifier('header', ['scrolled'], [isScrolled])}>
      <div className="grid">
        <div
          className={`header-dropdown ${
            isDropdownOpen ? 'header-dropdown--open' : ''
          }`}>
          <button
            className="header-dropdown__toggler"
            type="button"
            onClick={toggleDropdown}>
            <figure className="header-avatar">
              <img src="" alt="" />
            </figure>
            <p className="header-greeting">
              Yo, Cris
              <span aria-label="Wave" role="img">
                {' '}
                👋
              </span>
            </p>
            <Icon icon="chevron-down" />
          </button>
          <ul className="header-dropdown-list">
            <li className="header-dropdown__item">
              <Link href="/">
                <a className="header-dropdown__link">Profile</a>
              </Link>
            </li>
            <li className="header-dropdown__item">
              <Link href="/">
                <a className="header-dropdown__link header-dropdown__link--logout">
                  Logout
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <button className="header-menu" type="button">
          <Icon icon="menu" />
        </button>
      </div>
    </div>
  );
};

export default Header;
