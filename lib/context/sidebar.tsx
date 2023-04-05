import React, { useState, useContext, FC, PropsWithChildren } from 'react';

interface SideBar {
  isSideBarOpen: boolean;
  openSideBar: () => void;
  closeSideBar: () => void;
}

const SideBarContext = React.createContext<SideBar | null>(null);

const SideBarProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const openSideBar = () => {
    setIsSideBarOpen(true);
  };

  const closeSideBar = () => {
    setIsSideBarOpen(false);
  };
  return (
    <SideBarContext.Provider
      value={{ isSideBarOpen, openSideBar, closeSideBar }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export const useSideBarContext = () => {
  const context = useContext(SideBarContext);

  if (context === null) {
    throw new Error('Component is not in provider.');
  }

  return context;
};

export { SideBarContext, SideBarProvider };
