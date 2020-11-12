import { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';
import Link from 'next/link';
import Icon from 'components/icon/icon';

// TODO: Menu, Accessbility, Desktop
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hideDropdown = useCallback(throttle(() => {
    setIsDropdownOpen(false);
  }, 300));

  const toggleDropdown = (e) => {
    e.stopPropagation();

    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    window.addEventListener('click', hideDropdown);

    return () => window.removeEventListener('click', hideDropdown);
  }, []);

  return (
    <div className="header">
      <div className="grid">
        <div
          className={`header-dropdown ${isDropdownOpen ? 'header-dropdown--open' : ''}`}
        >
          <button
            className="header-dropdown__toggler"
            type="button"
            onClick={toggleDropdown}
          >
            <figure className="header-avatar">
              <img src="" alt="" />
            </figure>
            <p className="header-greeting">
              Yo, Cris
              <span aria-label="Wave" role="img"> 👋</span>
            </p>
            <Icon icon="chevron-down" />
          </button>
          <ul className="header-dropdown-list">
            <li className="header-dropdown__item">
              <Link href="#">
                <a className="header-dropdown__link">
                  Profile
                </a>
              </Link>
            </li>
            <li className="header-dropdown__item">
              <Link href="#">
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
