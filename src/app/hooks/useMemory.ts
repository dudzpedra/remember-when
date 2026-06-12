/**
 * Memory Hooks
 * Consolidated hooks for managing memory operations
 * - useRandomMemory: Fetches and manages random memory display
 * - useCreateMemory: Handles memory creation with file upload
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMemory, getRandomMemory } from '@/services/memoryService';
import { CreateMemoryPayload, CreateMemoryResponse, Memory } from '@/types/memory';
import * as Sentry from '@sentry/nextjs';

/**
 * Hook for fetching and displaying random memories
 * Provides navigation to next memory
 */
export function useRandomMemory() {
  const {
    data: memory,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<Memory>({
    queryKey: ['randomMemory'],
    queryFn: getRandomMemory,
  });

  return {
    memory,
    isLoading: isPending,
    isError,
    error,
    nextMemory: refetch,
  };
}

interface UseCreateMemoryResult {
  mutate: (payload: CreateMemoryPayload) => Promise<CreateMemoryResponse>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  data: CreateMemoryResponse | undefined;
  reset: () => void;
}

/**
 * Hook for creating a new memory
 * Automatically invalidates related queries on success
 * Captures errors in Sentry for monitoring
 *
 * @returns {UseCreateMemoryResult} Mutation state and controls
 */
export function useCreateMemory(): UseCreateMemoryResult {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createMemory,
    onSuccess: () => {
      // Invalidate random memory query to show potentially new memories
      queryClient.invalidateQueries({ queryKey: ['randomMemory'] });
      // Invalidate memories list
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
    onError: (error) => {
      // Capture error in Sentry for monitoring
      Sentry.captureException(error, {
        tags: {
          feature: 'memory_creation',
        },
      });
    },
  });

  return {
    mutate: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
