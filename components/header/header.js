import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import useLayoutContext from 'js/contexts/layout';
import { initialValues, menus } from 'js/shapes/header';
import cssClassModifier from 'js/utils/cssClassModifier';
import Icon from 'components/icon/icon';

// TODO:
// Menu, Accessbility, Desktop
const Header = () => {
  // contexts
  const { handlers } = useLayoutContext();

  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modals, setModals] = useState({ settings: false, profile: false });

  // custom hooks
  const [, , removeCookie] = useCookies();
  const router = useRouter();

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

  const handleLogout = () => {
    removeCookie('user');
    router.push('/login');
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
    <Formik initialValues={initialValues}>
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
            <p className="header-greeting">Admin</p>
            <Icon icon="chevron-down" />
          </button>
          <ul className="header-dropdown-list">
            {menus.map(({ key, label }) => (
              <li key={key} className="header-dropdown__item">
                <button
                  className="header-dropdown__button"
                  onClick={handleOpenModal(key)}>
                  {label}
                </button>
              </li>
            ))}
            <li className="header-dropdown__item">
              <button
                className="header-dropdown__button header-dropdown__button--logout"
                onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
        <button
          className="header-menu"
          type="button"
          onClick={handlers.openSidebar}>
          <Icon icon="menu" />
        </button>

        {/* MODALS ARE RENDERED HERE */}
        {menus.map(({ key, modal: MenuModal }) => (
          <MenuModal
            key={key}
            isOpen={modals[key]}
            onClose={handleCloseModal(key)}
          />
        ))}
      </header>
    </Formik>
  );
};

export default Header;
