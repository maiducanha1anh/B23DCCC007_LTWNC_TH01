/**
 * Assignment Feature Models & Types
 * Demonstrates:
 * - Interface / Type definitions
 * - Union Types
 * - Utility Types (Pick, Omit, Partial, Record)
 * - Type Guards
 */

// ==========================================
// 1. Core Models & Union Types
// ==========================================

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type DeadlineFilter = 'ALL' | 'PENDING' | 'OVERDUE' | 'COMPLETED';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  deadline: string; // ISO format: 'YYYY-MM-DD'
  priority: Priority;
  completed: boolean;
  createdAt?: string;
}

// ==========================================
// 2. Utility Types Implementations
// ==========================================

/**
 * Utility Type: Omit
 * Used for creating new assignment where id and completed status are auto-generated
 */
export type AssignmentFormData = Omit<Assignment, 'id' | 'completed' | 'createdAt'>;

/**
 * Utility Type: Pick
 * Extracted header summary for cards or list preview items
 */
export type AssignmentHeaderData = Pick<Assignment, 'subject' | 'priority'>;
export type AssignmentSummary = Pick<Assignment, 'id' | 'title' | 'deadline' | 'completed'>;

/**
 * Utility Type: Partial & Record
 * Type for field validation errors mapping form field keys to error messages
 */
export type AssignmentFormErrors = Partial<Record<keyof AssignmentFormData, string>>;

/**
 * Utility Type: Record
 * Metadata configuration mapping for priorities (colors, labels, badges)
 */
export interface PriorityConfig {
  label: string;
  badgeClass: string;
  color: string;
  bgLight: string;
  order: number;
}

export const PRIORITY_CONFIG: Record<Priority, PriorityConfig> = {
  LOW: {
    label: 'Thấp',
    badgeClass: 'priority-low',
    color: '#10b981',
    bgLight: '#ecfdf5',
    order: 1,
  },
  MEDIUM: {
    label: 'Trung bình',
    badgeClass: 'priority-medium',
    color: '#f59e0b',
    bgLight: '#fffbeb',
    order: 2,
  },
  HIGH: {
    label: 'Cao',
    badgeClass: 'priority-high',
    color: '#ef4444',
    bgLight: '#fef2f2',
    order: 3,
  },
};

/**
 * Record for deadline filter human-readable labels
 */
export const FILTER_LABELS: Record<DeadlineFilter, string> = {
  ALL: 'Tất cả',
  PENDING: 'Chưa hoàn thành',
  OVERDUE: 'Quá hạn',
  COMPLETED: 'Đã hoàn thành',
};

// ==========================================
// 3. Type Guards
// ==========================================

/**
 * Type Guard for Priority
 * Checks if an unknown value is a valid Priority union member
 */
export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (['LOW', 'MEDIUM', 'HIGH'] as const).includes(value as Priority);
}

/**
 * Type Guard for DeadlineFilter
 */
export function isDeadlineFilter(value: unknown): value is DeadlineFilter {
  return (
    typeof value === 'string' &&
    (['ALL', 'PENDING', 'OVERDUE', 'COMPLETED'] as const).includes(value as DeadlineFilter)
  );
}

/**
 * Type Guard for Assignment object
 * Validates complex object shape safely at runtime
 */
export function isAssignment(value: unknown): value is Assignment {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.subject === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.deadline === 'string' &&
    typeof candidate.completed === 'boolean' &&
    isPriority(candidate.priority)
  );
}

/**
 * Type Guard for checking array of Assignments
 */
export function isAssignmentArray(value: unknown): value is Assignment[] {
  return Array.isArray(value) && value.every(isAssignment);
}
