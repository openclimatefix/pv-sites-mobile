import React, { useState, useContext, FC, PropsWithChildren } from 'react';
import { App } from './types';

const AppContext = React.createContext<App | null>(null);

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [prevDashboardUUID, setPrevDashboardUUID] = useState<string>('');

  return (
    <AppContext.Provider
      value={{
        prevDashboardUUID,
        setPrevDashboardUUID,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error('Component is not in provider.');
  }

  return context;
};

export { AppContext, AppProvider };
