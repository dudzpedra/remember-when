/**
 * Memory Service
 * Encapsulates all memory-related API operations
 * Follows service layer pattern for maintainability and testability
 */

import { api } from '@/app/lib/api';
import {
  Memory,
  CreateMemoryPayload,
  CreateMemoryResponse,
  MemoryQueryParams,
  PaginatedMemoryResponse,
} from '@/types/memory';

/**
 * Fetches a random memory from the database
 * @throws {Error} If the request fails
 * @returns {Promise<Memory>} A random memory
 */
export async function getRandomMemory(): Promise<Memory> {
  const response = await api.get<Memory>('/memories');
  return response.data;
}

/**
 * Fetches memories with pagination and filtering
 * @param {MemoryQueryParams} params - Query parameters for filtering and pagination
 * @throws {Error} If the request fails
 * @returns {Promise<PaginatedMemoryResponse>} Paginated list of memories
 */
export async function getMemories(
  params: MemoryQueryParams = {}
): Promise<PaginatedMemoryResponse> {
  const response = await api.get<PaginatedMemoryResponse>('/memories/list', {
    params,
  });
  return response.data;
}

/**
 * Creates a new memory with image upload
 * Handles multipart form data for file upload
 * 
 * @param {CreateMemoryPayload} payload - Memory data and image file
 * @throws {Error} If the request fails or validation fails
 * @returns {Promise<CreateMemoryResponse>} Response with created memory
 */
export async function createMemory(
  payload: CreateMemoryPayload
): Promise<CreateMemoryResponse> {
  const formData = new FormData();
  formData.append('phrase', payload.phrase);
  formData.append('imageFile', payload.imageFile);
  console.log('FormData entries:', Array.from(formData.entries()));

  const { data, status } = await api.post<CreateMemoryResponse>('/memories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // const data = (await response.json()) as CreateMemoryResponse;

  if (status !== 201) {
    throw new Error(data.error?.message || 'Failed to create memory');
  }

  return data;
}

/**
 * Deletes a memory by ID
 * @param {string} id - Memory ID to delete
 * @throws {Error} If the request fails or memory not found
 * @returns {Promise<void>}
 */
export async function deleteMemory(id: string): Promise<void> {
  await api.delete(`/memories/${id}`);
}

/**
 * Updates a memory
 * @param {string} id - Memory ID
 * @param {Partial<Memory>} data - Partial memory data to update
 * @throws {Error} If the request fails
 * @returns {Promise<Memory>} Updated memory
 */
export async function updateMemory(
  id: string,
  data: Partial<Memory>
): Promise<Memory> {
  const response = await api.patch<Memory>(`/memories/${id}`, data);
  return response.data;
}
