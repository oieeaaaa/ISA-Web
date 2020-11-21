import { useState, createContext, useContext } from 'react';

// init context
const LayoutContext = createContext();

// provider
export const LayoutProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const layoutContextValue = {
    isSidebarOpen,
    handlers: {
      openSidebar: () => setIsSidebarOpen(true),
      closeSidebar: () => setIsSidebarOpen(false)
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
