/**
 * Generic API and Application Types
 * Demonstrates TypeScript Generics, Union Types, and Utility Patterns
 */

/**
 * Generic API response envelope
 * @template T Type of data returned
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
  timestamp: string;
}

/**
 * Generic Result type pattern (Success or Error)
 * @template T Type of success data
 * @template E Type of error payload (defaults to string)
 */
export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Generic Filter Predicate function
 * @template T Type of items being filtered
 */
export type FilterPredicate<T> = (item: T) => boolean;

/**
 * Generic Sort Comparator function
 * @template T Type of items being sorted
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Generic Async Operation Status
 */
export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
