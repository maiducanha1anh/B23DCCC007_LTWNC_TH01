import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  setFilter as setFilterAction,
  setSearchQuery as setSearchQueryAction,
} from '../features/assignments/assignmentSlice';
import {
  selectAssignmentCounts,
  selectAssignmentFilter,
  selectFilteredAssignments,
  selectSearchQuery,
  type AssignmentCounts,
} from '../features/assignments/assignmentSelectors';
import type { Assignment, DeadlineFilter } from '../features/assignments/assignmentTypes';

export interface UseAssignmentFilterReturn {
  currentFilter: DeadlineFilter;
  searchQuery: string;
  filteredAssignments: Assignment[];
  counts: AssignmentCounts;
  setFilter: (filter: DeadlineFilter) => void;
  setSearchQuery: (query: string) => void;
  clearFilter: () => void;
}

/**
 * Advanced Custom Hook: useAssignmentFilter
 * Encapsulates all filtering and search business logic away from JSX components
 */
export function useAssignmentFilter(): UseAssignmentFilterReturn {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector(selectAssignmentFilter);
  const searchQuery = useAppSelector(selectSearchQuery);
  const filteredAssignments = useAppSelector(selectFilteredAssignments);
  const counts = useAppSelector(selectAssignmentCounts);

  const setFilter = useCallback(
    (newFilter: DeadlineFilter) => {
      dispatch(setFilterAction(newFilter));
    },
    [dispatch]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQueryAction(query));
    },
    [dispatch]
  );

  const clearFilter = useCallback(() => {
    dispatch(setFilterAction('ALL'));
    dispatch(setSearchQueryAction(''));
  }, [dispatch]);

  return {
    currentFilter,
    searchQuery,
    filteredAssignments,
    counts,
    setFilter,
    setSearchQuery,
    clearFilter,
  };
}
