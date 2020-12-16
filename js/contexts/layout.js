import { useState, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { AUTH_KEY } from 'js/shapes/cookies';

// init context
const LayoutContext = createContext();

// provider
export const LayoutProvider = ({ children }) => {
  const [cookies, , removeCookie] = useCookies([AUTH_KEY]);
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logout = () => {
    removeCookie(AUTH_KEY);
    router.push('/login');
  };

  const layoutContextValue = {
    isSidebarOpen,
    handlers: {
      openSidebar: () => setIsSidebarOpen(true),
      closeSidebar: () => setIsSidebarOpen(false)
    },
    auth: {
      token: cookies[AUTH_KEY]?.token,
      user: cookies[AUTH_KEY]?.user,
      logout
    }
  };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

// hook
const useLayoutContext = () => {
  const layoutContext = useContext(LayoutContext);

  return layoutContext;
};

export default useLayoutContext;
