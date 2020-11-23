import { useState, createContext, useContext } from 'react';
import defaultValues from 'js/shapes/app';

// init context
const AppContext = createContext();

// provider
export const AppProvider = ({ children }) => {
  const [notification, setNotification] = useState(defaultValues.notification);

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
    }
  };

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
