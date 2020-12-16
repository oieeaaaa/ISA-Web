import { useState, useEffect, useCallback } from 'react';
import { Formik } from 'formik';
import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import useLayoutContext from 'js/contexts/layout';
import { menus } from 'js/shapes/header';
import fetcher from 'js/utils/fetcher';
import safety from 'js/utils/safety';
import cssClassModifier from 'js/utils/cssClassModifier';
import Icon from 'components/icon/icon';

// TODO:
// Menu, Accessbility, Desktop
const Header = () => {
  // contexts
  const { auth, handlers } = useLayoutContext();

  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modals, setModals] = useState({ settings: false, profile: false });
  const [user, setUser] = useState({});

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

  const getUser = async () => {
    try {
      const { data } = await fetcher(`/user/${safety(auth, 'user.id', '')}`);

      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

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

    // fetch user
    getUser();

    return () => {
      window.removeEventListener('click', hideDropdown);
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  return (
    <>
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
            <p className="header-greeting">
              {safety(user, 'displayName', 'Admin')}
            </p>
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
                onClick={auth.logout}>
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
      </header>
      {/* MODALS ARE RENDERED HERE */}
      {menus.map(
        ({ key, initialValues, validationSchema, modal: MenuModal }) => (
          <Formik
            key={key}
            validationSchema={validationSchema}
            initialValues={initialValues}
            validateOnBlur={false}
            validateOnMount={false}
            validateOnChange={false}>
            <MenuModal isOpen={modals[key]} onClose={handleCloseModal(key)} />
          </Formik>
        )
      )}
    </>
  );
};

export default Header;
