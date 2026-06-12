/**
 * REMEMBER WHEN - SIDEBAR LAYOUT ARCHITECTURE
 * 
 * This document outlines the senior-level architecture for the sidebar layout system,
 * including memory management, image uploads, and tab-based navigation.
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 1. TYPE SYSTEM (@/app/types/memory.ts)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Core type definitions with comprehensive JSDoc:
 * 
 * - Memory: Base entity representing a stored memory
 * - CreateMemoryPayload: Input structure for creating memories (phrase + image)
 * - CreateMemoryResponse: Standardized API response with success flag and error handling
 * - MemoryQueryParams: Pagination and filtering options
 * - PaginatedMemoryResponse: Typed paginated results
 * 
 * Benefits:
 * ✓ Type-safe throughout the application
 * ✓ Clear contracts between layers
 * ✓ Self-documenting via JSDoc
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 2. SERVICE LAYER (@/app/services/memoryService.ts)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Encapsulates all HTTP operations with proper separation of concerns:
 * 
 * Functions:
 * - getRandomMemory(): Fetches a random memory (GET /api/memories)
 * - getMemories(params): Fetches paginated memories (GET /api/memories/list)
 * - createMemory(payload): Creates new memory with image (POST /api/memories)
 * - deleteMemory(id): Removes a memory
 * - updateMemory(id, data): Updates memory metadata
 * 
 * Benefits:
 * ✓ Single responsibility principle - only API communication
 * ✓ Easy to unit test - pure functions
 * ✓ Centralized error handling
 * ✓ Consistent API client configuration (via api.ts with axios)
 * ✓ Multipart form-data handling for file uploads
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 3. CUSTOM HOOKS (@/app/hooks/useCreateMemory.ts)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * React Query integration for state management:
 * 
 * useCreateMemory():
 * - Wraps createMemory service with useMutation
 * - Manages loading, error, and success states
 * - Auto-invalidates related queries on success
 * - Integrates with Sentry for error monitoring
 * - Returns: { mutate, isPending, isError, error, data, reset }
 * 
 * Benefits:
 * ✓ React Query handles caching and synchronization
 * ✓ Automatic refetch on success
 * ✓ Built-in error tracking
 * ✓ Optimistic updates ready to implement
 * ✓ Persistent state across re-renders
 * 
 * Existing Hook:
 * - useRandomMemory(): Already in place, uses React Query for fetching random memories
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 4. API ROUTES (@/app/api/memories/route.ts)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Backend handlers for all memory operations:
 * 
 * GET /api/memories
 * - Fetches random memory via Supabase RPC
 * - Error handling with Sentry integration
 * 
 * POST /api/memories (NEW)
 * - Accepts multipart form-data (phrase + imageFile)
 * - Comprehensive validation:
 *   ✓ Required fields validation
 *   ✓ File size limit (5MB)
 *   ✓ File type validation (JPEG, PNG, WebP, GIF)
 * - File handling:
 *   ✓ Converts File to Buffer
 *   ✓ Generates unique file names with timestamps
 *   ✓ Uploads to Supabase Storage under /memories/{timestamp-random}/{filename}
 *   ✓ Retrieves public URL
 * - Database:
 *   ✓ Inserts record to 'memories' table
 *   ✓ Links uploaded image via public URL
 *   ✓ Returns created memory record
 * - Error handling with Sentry tagging for feature tracking
 * - Returns standardized CreateMemoryResponse
 * 
 * Benefits:
 * ✓ Server-side file validation (security)
 * ✓ Centralized error handling
 * ✓ Proper HTTP status codes (201 for creation)
 * ✓ Type-safe responses
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 5. UI COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Component Hierarchy:
 * 
 * MainLayout (src/app/components/MainLayout/index.tsx)
 * ├── Props: { albumContent, newMemoryContent }
 * ├── Manages: Active tab state
 * ├── Renders: Two-column layout with sidebar
 * └── Content: Dynamic based on activeTab
 * 
 * AppSidebar (src/app/components/AppSidebar/index.tsx)
 * ├── Props: { activeTab, onTabChange }
 * ├── Menu Items: Album, New Memory
 * ├── Icons: PictureOutlined, FileAddOutlined
 * └── Features: Ant Design Menu component
 * 
 * AlbumContent (src/app/components/AlbumContent/index.tsx)
 * ├── Renders: PageHeader + MemoryCard
 * ├── Use Case: Album tab content
 * └── Features: Memory display with navigation
 * 
 * NewMemoryForm (src/app/components/NewMemoryForm/index.tsx) [NEW]
 * ├── Features:
 * │   ✓ Form with validation (Ant Design Form)
 * │   ✓ TextArea for memory description (500 char limit)
 * │   ✓ File upload with preview
 * │   ✓ File validation (type, size)
 * │   ✓ Real-time file info display
 * │   ✓ Upload progress simulation
 * │   ✓ Error/success messages
 * ├── Props: { onSuccess?, onError? }
 * ├── State: form, uploadProgress
 * └── Hooks: useCreateMemory (for API calls)
 * 
 * Existing Components:
 * - MemoryCard: Displays single memory with image and text
 * - PageHeader: Page title/branding
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 6. DATA FLOW ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * CREATE MEMORY FLOW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 1. User fills NewMemoryForm                                 │
 * │    - Enters phrase (validated: 3-500 chars)                │
 * │    - Selects image file (validated: type, size)            │
 * └─────────────────────────────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 2. Form submission triggers useCreateMemory.mutate()       │
 * │    - useCreateMemory hook activated                         │
 * │    - isPending state = true                                 │
 * └─────────────────────────────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 3. createMemory() service called (memoryService.ts)        │
 * │    - Builds FormData with phrase + file                    │
 * │    - POSTs to /api/memories with multipart content-type    │
 * └─────────────────────────────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 4. POST /api/memories handler                               │
 * │    - Extracts form data (phrase, imageFile)               │
 * │    - Validates both fields                                 │
 * │    - Uploads image to Supabase Storage                     │
 * │    - Inserts record to database                            │
 * │    - Returns CreateMemoryResponse                          │
 * └─────────────────────────────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 5. useCreateMemory receives response                        │
 * │    - onSuccess callback triggered                           │
 * │    - Invalidates randomMemory and memories queries         │
 * │    - Shows success message                                  │
 * │    - Form resets                                            │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ALBUM VIEW FLOW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 1. User clicks "Album" in sidebar                           │
 * │    - onTabChange('album') called                           │
 * │    - activeTab state updated                               │
 * └─────────────────────────────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 2. MainLayout renders AlbumContent                          │
 * │    - Shows PageHeader + MemoryCard                         │
 * │    - MemoryCard uses useRandomMemory hook                  │
 * └─────────────────────────────────────────────────────────────┘
 *                          │
 *                          ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 3. useRandomMemory fetches from GET /api/memories          │
 * │    - Displays random memory                                 │
 * │    - Shows next button to fetch another                    │
 * └─────────────────────────────────────────────────────────────┘
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 7. FILE STRUCTURE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * src/
 * ├── app/
 * │   ├── components/
 * │   │   ├── AlbumContent/
 * │   │   │   └── index.tsx (NEW)
 * │   │   ├── AppSidebar/
 * │   │   │   └── index.tsx (NEW)
 * │   │   ├── MainLayout/
 * │   │   │   └── index.tsx (NEW)
 * │   │   ├── NewMemoryForm/
 * │   │   │   └── index.tsx (NEW)
 * │   │   ├── MemoryCard/
 * │   │   │   └── index.tsx (EXISTING)
 * │   │   └── PageHeader/
 * │   │       └── index.tsx (EXISTING)
 * │   ├── hooks/
 * │   │   ├── useCreateMemory.ts (NEW)
 * │   │   └── useRandomMemory.ts (EXISTING)
 * │   ├── api/
 * │   │   └── memories/
 * │   │       └── route.ts (UPDATED - added POST handler)
 * │   ├── lib/
 * │   │   ├── api.ts (EXISTING)
 * │   │   └── supabase/
 * │   │       └── supabase.ts (EXISTING)
 * │   ├── page.tsx (UPDATED)
 * │   └── layout.tsx (EXISTING)
 * │
 * ├── services/
 * │   └── memoryService.ts (NEW)
 * │
 * └── types/
 *     └── memory.ts (NEW)
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 8. DEPENDENCIES USED
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Already in package.json:
 * - antd: UI components (Menu, Layout, Form, Upload, Button, etc.)
 * - react: Component framework
 * - @tanstack/react-query: State management and data fetching
 * - axios: HTTP client (configured in api.ts)
 * - @supabase/supabase-js: Database and storage
 * - @sentry/nextjs: Error monitoring
 * 
 * No new dependencies needed!
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 9. SCALABILITY & FUTURE ENHANCEMENTS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The current architecture supports:
 * 
 * ✓ Easy pagination addition (MemoryQueryParams already supports it)
 * ✓ Image gallery component for displaying all memories
 * ✓ Memory search/filter functionality
 * ✓ Optimistic updates (React Query ready)
 * ✓ Infinite scroll pagination
 * ✓ Memory editing/deletion UI
 * ✓ Image lazy loading with Next.js Image component
 * ✓ Analytics integration (Sentry hooks in place)
 * ✓ Internationalization (all UI strings can be i18n)
 * ✓ Dark mode (Ant Design theme support)
 * ✓ Mobile responsive layout (Ant Design Grid system)
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 10. TESTING STRATEGY
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Service Layer (memoryService.ts):
 * - Mock axios for unit tests
 * - Test each service function independently
 * - Verify API endpoints and payloads
 * 
 * Hooks (useCreateMemory.ts):
 * - Use react-query's test utilities
 * - Mock service layer
 * - Test mutation states and callbacks
 * 
 * Components:
 * - Mock useCreateMemory hook
 * - Test form validation
 * - Test file upload handling
 * - Test error/success states
 * 
 * API Routes:
 * - Test with Next.js testing utilities
 * - Mock Supabase client
 * - Test validation logic
 * - Test file upload handling
 */

export const ARCHITECTURE_NOTES = 'See above for detailed documentation';
