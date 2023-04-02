import React, { useState, useContext, FC, ReactNode } from 'react';

interface Sidebar {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

interface SidebarProviderProps {
  children: ReactNode | ReactNode[];
}

const SidebarContext = React.createContext<Sidebar | null>(null);

const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <SidebarContext.Provider
      value={{ isSidebarOpen, openSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (context === null) {
    throw new Error('Component is not in provider.');
  }

  return context;
};

export { SidebarContext, SidebarProvider };
