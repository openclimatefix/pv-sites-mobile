import React, { useState, useContext, FC, ReactNode } from 'react';

interface Sidebar {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

interface AppProviderProps {
  children: ReactNode | ReactNode[];
}

const AppContext = React.createContext<Sidebar | null>(null);

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <AppContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar }}>
      {children}
    </AppContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error('Component is not in provider.');
  }

  return context;
};

export { AppContext, AppProvider };
