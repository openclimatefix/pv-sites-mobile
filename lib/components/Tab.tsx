// Tab.tsx
import React, { ReactNode } from 'react';

interface TabProps {
  label: string;
  children: ReactNode;
}

const Tab: React.FC<TabProps> = ({ label, children }) => {
  return (
    <div>
      {label && <div>{label}</div>}
      {children && <div>{children}</div>}
    </div>
  );
};

export default Tab;
