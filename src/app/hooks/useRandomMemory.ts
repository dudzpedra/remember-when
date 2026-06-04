"use client";

import { useQuery } from '@tanstack/react-query';
import { getRandomMemory } from '../services/memoryService';

export function useRandomMemory() {
  const {
    data: memory,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['randomMemory'],
    queryFn: getRandomMemory,
    // staleTime: 10 * 60 * 1000,
    // gcTime: 0,
  });

  return {
    memory,
    isLoading: isPending,
    isError,
    error,
    nextMemory: refetch,
  };
}