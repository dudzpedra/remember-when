/**
 * AppSidebar Component
 * Navigation sidebar with memory management options
 * Provides tab-like navigation between different views
 */

'use client';

import React from 'react';
import { Menu, MenuProps } from 'antd';
import {
  PictureOutlined,
  FileAddOutlined,
} from '@ant-design/icons';

export type SidebarTab = 'album' | 'new-memory';

interface AppSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

const menuItems: MenuProps['items'] = [
  {
    key: 'album',
    icon: <PictureOutlined />,
    label: 'Album',
    title: 'View your memory collection',
  },
  {
    key: 'new-memory',
    icon: <FileAddOutlined />,
    label: 'New Memory',
    title: 'Create a new memory',
  },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    onTabChange(e.key as SidebarTab);
  };

  return (
    <Menu
      mode="vertical"
      selectedKeys={[activeTab]}
      onClick={handleMenuClick}
      items={menuItems}
      style={{
        height: '100%',
        borderRight: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        paddingTop: '24px',
      }}
    />
  );
};

export default AppSidebar;
