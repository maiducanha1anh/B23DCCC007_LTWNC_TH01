import React, { createContext, useContext } from 'react';
import { Search, X } from 'lucide-react';
import type { DeadlineFilter } from '../assignmentTypes';
import { useAssignmentFilter } from '../../../hooks/useAssignmentFilter';

// ==========================================
// 1. Compound Component Pattern: Filter
// ==========================================

interface FilterContextType {
  value: DeadlineFilter;
  onChange: (val: DeadlineFilter) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

function useFilterContext(): FilterContextType {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('Filter.Item must be used within a <Filter>');
  }
  return ctx;
}

export interface FilterProps {
  value: DeadlineFilter;
  onChange: (val: DeadlineFilter) => void;
  children: React.ReactNode;
  className?: string;
}

const FilterRoot: React.FC<FilterProps> = ({ value, onChange, children, className = '' }) => {
  return (
    <FilterContext.Provider value={{ value, onChange }}>
      <nav className={`filter-tab-group ${className}`} role="tablist" aria-label="Bộ lọc bài tập">
        {children}
      </nav>
    </FilterContext.Provider>
  );
};

export interface FilterItemProps {
  value: DeadlineFilter;
  count?: number;
  children: React.ReactNode;
}

const FilterItem: React.FC<FilterItemProps> = ({ value, count, children }) => {
  const { value: activeValue, onChange } = useFilterContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`filter-tab-btn ${isActive ? 'active' : ''}`}
      onClick={() => onChange(value)}
    >
      <span className="tab-label">{children}</span>
      {typeof count === 'number' && <span className="tab-badge">{count}</span>}
    </button>
  );
};

export const Filter = Object.assign(FilterRoot, {
  Item: FilterItem,
});

// ==========================================
// 2. High-level AssignmentFilter Component
// ==========================================

export const AssignmentFilter: React.FC = () => {
  const { currentFilter, searchQuery, counts, setFilter, setSearchQuery } = useAssignmentFilter();

  return (
    <div className="assignment-filter-container">
      {/* Search Input Bar */}
      <div className="filter-search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo môn học hoặc tên bài tập..."
          className="search-input"
          aria-label="Tìm kiếm bài tập"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Xoá tìm kiếm"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Compound Component Filter Tabs */}
      <Filter value={currentFilter} onChange={setFilter}>
        <Filter.Item value="ALL" count={counts.all}>
          Tất cả
        </Filter.Item>
        <Filter.Item value="PENDING" count={counts.pending}>
          Chưa hoàn thành
        </Filter.Item>
        <Filter.Item value="OVERDUE" count={counts.overdue}>
          Quá hạn
        </Filter.Item>
        <Filter.Item value="COMPLETED" count={counts.completed}>
          Đã hoàn thành
        </Filter.Item>
      </Filter>
    </div>
  );
};
