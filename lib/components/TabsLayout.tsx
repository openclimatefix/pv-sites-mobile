// TwoTabLayout.tsx
import React, { useState, ReactElement } from 'react';

interface TabsLayoutProps {
  children: ReactElement[];
}

const TabsLayout: React.FC<TabsLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center">
        {children.map((tab, index) => (
          <button
            key={`tab-button-${index}`}
            className={`rounded-t-lg px-4 py-2 text-white ${
              activeTab === index
                ? 'bg-blue-600'
                : 'bg-gray-300 hover:bg-gray-400 focus:outline-none'
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      {children.map((tabContent, index) => (
        <div
          key={`tab-content-${index}`}
          className={`rounded-b-lg p-4 ${
            activeTab === index ? 'bg-blue-600' : 'hidden'
          }`}
        >
          {tabContent}
        </div>
      ))}
    </div>
  );
};

export default TabsLayout;
