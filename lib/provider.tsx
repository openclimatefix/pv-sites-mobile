import React, { useState, useContext, FC, PropsWithChildren } from 'react';
import { AppContextProps } from './types';

/**
 * Serves as a single context for relevant app data that needs to be stored made available through the entire application.
 * This context is intended to be expanded in future features as needed.
 */

const AppContext = React.createContext<AppContextProps | null>(null);

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
