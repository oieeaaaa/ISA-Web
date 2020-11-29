import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Formik } from 'formik';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import useLayoutContext from 'js/contexts/layout';
import cssClassModifier from 'js/utils/cssClassModifier';
import Icon from 'components/icon/icon';
import Settings from 'components/settings/settings';

// TODO:
// Menu, Accessbility, Desktop
// Create shapes for initialValues
const Header = () => {
  // contexts
  const { handlers } = useLayoutContext();

  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modals, setModals] = useState({ settings: false });

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

  const handleOpenModal = (name) => (e) => {
    e.preventDefault();

    setModals((prevModals) => ({
      ...prevModals,
      [name]: true
    }));
  };

  const handleCloseModal = (name) => (e) => {
    e.preventDefault();

    setModals((prevModals) => ({
      ...prevModals,
      [name]: false
    }));
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
    <Formik initialValues={{ codes: [], removedCodes: [] }}>
      <header
        className={cssClassModifier('header', ['scrolled'], [isScrolled])}>
        <div
          className={cssClassModifier(
            'header-dropdown',
            ['open'],
            [isDropdownOpen]
          )}>
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
              <button className="header-dropdown__link">Profile</button>
            </li>
            <li className="header-dropdown__item">
              <button
                className="header-dropdown__link"
                onClick={handleOpenModal('settings')}>
                Settings
              </button>
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
        <button
          className="header-menu"
          type="button"
          onClick={handlers.openSidebar}>
          <Icon icon="menu" />
        </button>
        <Settings
          isOpen={modals.settings}
          onClose={handleCloseModal('settings')}
        />
      </header>
    </Formik>
  );
};

export default Header;
