/**
 * MainLayout Component
 * Provides the main application layout with sidebar navigation
 * Manages the active tab state and renders appropriate content
 */

'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import AppSidebar, { SidebarTab } from '@/app/components/AppSidebar';

interface MainLayoutProps {
  albumContent: React.ReactNode;
  newMemoryContent: React.ReactNode;
}

/**
 * Main layout wrapper with sidebar navigation
 * Manages tab state and renders the appropriate content section
 * 
 * @param {ReactNode} albumContent - Content to display in Album tab
 * @param {ReactNode} newMemoryContent - Content to display in New Memory tab
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  albumContent,
  newMemoryContent,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('album');

  const renderContent = () => {
    switch (activeTab) {
      case 'album':
        return albumContent;
      case 'new-memory':
        return newMemoryContent;
      default:
        return albumContent;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
        width={200}
        style={{
          backgroundColor: 'var(--surface)',
        }}
      >
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content
          style={{
            padding: '24px',
            backgroundColor: 'var(--background)',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {renderContent()}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
