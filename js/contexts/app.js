import { useState, createContext, useContext, useEffect } from 'react';
import fetcher from 'js/utils/fetcher';
import messages from 'js/messages';
import defaultValues from 'js/shapes/app';

// init context
const AppContext = createContext();

// provider
export const AppProvider = ({ children }) => {
  const [notification, setNotification] = useState(defaultValues.notification);
  const [codes, setCodes] = useState([]);

  const getCodes = async () => {
    try {
      const { data } = await fetcher('/helpers/code');

      setCodes(data);
    } catch (error) {
      appContextValue.notification.open({
        variant: 'danger',
        message: messages.error.retrieve
      });
    }
  };

  const appContextValue = {
    notification: {
      ...notification,
      close: () =>
        setNotification((prevNotification) => ({
          ...prevNotification,
          isActive: false
        })),
      open: (newNotification) =>
        setNotification((prevNotification) => ({
          ...prevNotification,
          ...newNotification,
          isActive: true
        }))
    },
    codes
  };

  // init stuff here
  useEffect(() => {
    getCodes();
  }, []);

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};

// hook
const useAppContext = () => {
  const appContext = useContext(AppContext);

  return appContext;
};

export default useAppContext;
