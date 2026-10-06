import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Assignment, DeadlineFilter } from './assignmentTypes';
import { calculateDeadlineInfo } from '../../utils/dateUtils';

// Base selectors
export const selectAssignmentsState = (state: RootState) => state.assignments;
export const selectAssignments = (state: RootState): Assignment[] => state.assignments.items;
export const selectAssignmentStatus = (state: RootState) => state.assignments.status;
export const selectAssignmentError = (state: RootState) => state.assignments.error;
export const selectAssignmentFilter = (state: RootState): DeadlineFilter => state.assignments.filter;
export const selectSearchQuery = (state: RootState): string => state.assignments.searchQuery;

/**
 * Helper to check if an assignment is overdue
 * Definition: deadline < today AND completed === false
 */
export function isAssignmentOverdue(assignment: Assignment, baseDate: Date = new Date()): boolean {
  if (assignment.completed) return false;
  const { isOverdue } = calculateDeadlineInfo(assignment.deadline, baseDate);
  return isOverdue;
}

/**
 * Memoized selector for filtered assignments
 * Implements strict business rules for all 4 filter tabs:
 * - ALL: all assignments
 * - PENDING: completed === false
 * - OVERDUE: deadline < today AND completed === false
 * - COMPLETED: completed === true
 */
export const selectFilteredAssignments = createSelector(
  [selectAssignments, selectAssignmentFilter, selectSearchQuery],
  (items, filter, searchQuery): Assignment[] => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      // 1. Apply search query if present
      if (query) {
        const matchesSubject = item.subject.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        if (!matchesSubject && !matchesTitle) {
          return false;
        }
      }

      // 2. Apply DeadlineFilter status
      switch (filter) {
        case 'PENDING':
          return item.completed === false;
        case 'OVERDUE':
          return isAssignmentOverdue(item);
        case 'COMPLETED':
          return item.completed === true;
        case 'ALL':
        default:
          return true;
      }
    });
  }
);

export interface AssignmentCounts {
  all: number;
  pending: number;
  overdue: number;
  completed: number;
}

/**
 * Memoized selector for assignment counts across each filter category
 */
export const selectAssignmentCounts = createSelector(
  [selectAssignments],
  (items): AssignmentCounts => {
    let pending = 0;
    let overdue = 0;
    let completed = 0;

    for (const item of items) {
      if (item.completed) {
        completed++;
      } else {
        pending++;
        if (isAssignmentOverdue(item)) {
          overdue++;
        }
      }
    }

    return {
      all: items.length,
      pending,
      overdue,
      completed,
    };
  }
);
