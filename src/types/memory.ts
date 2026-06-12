/**
 * Memory domain types
 * Defines the shape of memory-related data structures
 */

/**
 * Base Memory entity representing a stored memory
 * Matches the database schema
 */
export interface Memory {
  id: string;
  phrase: string;
  image_url: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

/**
 * Payload for creating a new memory
 * Handles file upload and text data
 */
export interface CreateMemoryPayload {
  phrase: string;
  imageFile: File;
}

/**
 * Response from create memory API
 * Contains the created memory and metadata
 */
export interface CreateMemoryResponse {
  success: boolean;
  data?: Memory;
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * Query parameters for memory retrieval
 * Supports pagination and filtering
 */
export interface MemoryQueryParams {
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response for memory queries
 */
export interface PaginatedMemoryResponse {
  data: Memory[];
  total: number;
  hasMore: boolean;
}
