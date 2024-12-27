import React, { useState } from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  activeTab?: string;
  onTabClick?: (value: string) => void;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  activeTab?: string;
}

export const Tabs = ({ children, defaultValue = '', className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  const handleTabClick = (value: string) => {
    console.log('Switching to tab:', value);
    setActiveTab(value);
  };

  const updatedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement<TabsTriggerProps | TabsContentProps>(child)) {
      return React.cloneElement(child, { activeTab, onTabClick: handleTabClick });
    }
    return child;
  });

  return <div className={`tabs ${className}`}>{updatedChildren}</div>;
};

export const TabsList = ({ children, className }: TabsListProps) => {
  return <div className={`tabs-list flex space-x-2 ${className}`}>{children}</div>;
};

export const TabsTrigger = ({
  children,
  value,
  activeTab,
  onTabClick,
}: TabsTriggerProps) => {
  return (
    <button
      className={`tabs-trigger px-4 py-2 rounded-lg ${
        activeTab === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
      }`}
      onClick={() => onTabClick && onTabClick(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value, activeTab }: TabsContentProps) => {
  console.log(`Rendering TabsContent with value=${value}, activeTab=${activeTab}`);
  return activeTab === value ? <div className="tabs-content mt-4">{children}</div> : null;
};
