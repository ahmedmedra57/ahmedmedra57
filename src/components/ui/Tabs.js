import { useState } from 'react';
import styled, { css } from 'styled-components';

/**
 * Tabs Component - Tabbed interface for organizing content
 *
 * Usage:
 * <Tabs defaultTab="overview">
 *   <TabPanel value="overview" label="Overview">
 *     <OverviewContent />
 *   </TabPanel>
 *   <TabPanel value="controls" label="Controls">
 *     <ControlsContent />
 *   </TabPanel>
 * </Tabs>
 */

export const Tabs = ({ children, defaultTab, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || children[0]?.props.value);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    if (onChange) {
      onChange(tabValue);
    }
  };

  // Extract tab labels and values from children
  const tabs = children.map((child) => ({
    value: child.props.value,
    label: child.props.label,
    icon: child.props.icon,
    badge: child.props.badge,
  }));

  return (
    <TabsContainer>
      <TabList role="tablist">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            role="tab"
            aria-selected={activeTab === tab.value}
            aria-controls={`panel-${tab.value}`}
            id={`tab-${tab.value}`}
            active={activeTab === tab.value}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.icon && <TabIcon>{tab.icon}</TabIcon>}
            <TabLabel>{tab.label}</TabLabel>
            {tab.badge !== undefined && tab.badge > 0 && (
              <TabBadge>{tab.badge}</TabBadge>
            )}
          </Tab>
        ))}
      </TabList>

      <TabContent>
        {children.map((child) => {
          if (child.props.value === activeTab) {
            return (
              <div
                key={child.props.value}
                role="tabpanel"
                id={`panel-${child.props.value}`}
                aria-labelledby={`tab-${child.props.value}`}
              >
                {child.props.children}
              </div>
            );
          }
          return null;
        })}
      </TabContent>
    </TabsContainer>
  );
};

/**
 * TabPanel Component - Individual tab content container
 *
 * Props:
 * - value: Unique identifier for the tab
 * - label: Display label for the tab
 * - icon: Optional icon (emoji or component)
 * - badge: Optional badge count
 */
export const TabPanel = ({ children, value, label, icon, badge }) => {
  // This component is primarily a container for Tabs to process
  // The actual rendering is handled by the Tabs component
  return <>{children}</>;
};

// Styled Components

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TabList = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding: 0 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px 12px 0 0;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.05);
  }

  ${({ active }) =>
    active &&
    css`
      color: #ffffff;
      font-weight: 600;
      border-bottom-color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);

      &:hover {
        background: rgba(59, 130, 246, 0.15);
      }
    `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`;

const TabIcon = styled.span`
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabLabel = styled.span`
  line-height: 1;
`;

const TabBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #ef4444;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  line-height: 1;
`;

const TabContent = styled.div`
  flex: 1;
  padding: 20px;
  background: rgba(35, 58, 84, 0.4);
  border-radius: 0 0 12px 12px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

export default Tabs;
