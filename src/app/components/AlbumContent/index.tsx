/**
 * AlbumContent Component
 * Displays the memory collection with the memory card
 * Serves as the Album tab content
 */

'use client';

import React from 'react';
import { Button, Flex, Space } from 'antd';
import MemoryCard from '@/app/components/MemoryCard';
import PageHeader from '@/app/components/PageHeader';
import { useRandomMemory } from '@/app/hooks/useMemory';

export const AlbumContent: React.FC = () => {
  const { isLoading, nextMemory  } = useRandomMemory();

  const handleClick = () => {
    nextMemory();
  }

  return (
    <Space
      vertical
      align="center"
      style={{ width: '100%' }}
    >
      <PageHeader />
      <Flex 
        gap={24}
        align="center"
      >
        <MemoryCard />
        <Button
          onClick={handleClick}
          loading={isLoading}
        >
          Próxima memória
        </Button>
      </Flex>
    </Space>
  );
};

export default AlbumContent;
