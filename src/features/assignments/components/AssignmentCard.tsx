import React, { createContext, useContext } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  AlertTriangle,
  Flame,
  Check,
  RotateCcw,
} from 'lucide-react';
import type { Assignment, Priority } from '../assignmentTypes';
import { PRIORITY_CONFIG } from '../assignmentTypes';
import { useDeadline, type UseDeadlineReturn } from '../../../hooks/useDeadline';

// ==========================================
// 1. Compound Component Context
// ==========================================

interface AssignmentCardContextType {
  assignment: Assignment;
  deadlineInfo: UseDeadlineReturn;
  onToggle: (id: string) => void;
  onDeleteRequest: (assignment: Assignment) => void;
}

const AssignmentCardContext = createContext<AssignmentCardContextType | null>(null);

function useAssignmentCardContext(): AssignmentCardContextType {
  const context = useContext(AssignmentCardContext);
  if (!context) {
    throw new Error('AssignmentCard subcomponents must be used within an <AssignmentCard>');
  }
  return context;
}

// ==========================================
// 2. Compound Component Root: AssignmentCard
// ==========================================

export interface AssignmentCardProps {
  assignment: Assignment;
  onToggle: (id: string) => void;
  onDeleteRequest: (assignment: Assignment) => void;
  children: React.ReactNode;
  className?: string;
}

export const AssignmentCardRoot: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggle,
  onDeleteRequest,
  children,
  className = '',
}) => {
  const deadlineInfo = useDeadline(assignment.deadline);

  // Status CSS modifiers
  const statusClass = assignment.completed
    ? 'card-status-completed'
    : deadlineInfo.isOverdue
    ? 'card-status-overdue'
    : deadlineInfo.isToday
    ? 'card-status-today'
    : 'card-status-upcoming';

  return (
    <AssignmentCardContext.Provider
      value={{
        assignment,
        deadlineInfo,
        onToggle,
        onDeleteRequest,
      }}
    >
      <article
        className={`assignment-card ${statusClass} ${className}`}
        data-id={assignment.id}
        data-completed={assignment.completed}
      >
        {children}
      </article>
    </AssignmentCardContext.Provider>
  );
};

// ==========================================
// 3. Subcomponent: AssignmentCard.Header
// ==========================================

export interface AssignmentCardHeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<AssignmentCardHeaderProps> = ({ children }) => {
  const { assignment } = useAssignmentCardContext();

  return (
    <header className="assignment-card-header">
      <div className="card-subject-badge" title={`Môn học: ${assignment.subject}`}>
        <span className="subject-icon">📚</span>
        <span className="subject-name">{assignment.subject}</span>
      </div>
      {children || <PriorityBadge priority={assignment.priority} />}
    </header>
  );
};

// ==========================================
// 4. Subcomponent: AssignmentCard.Title
// ==========================================

export interface AssignmentCardTitleProps {
  onClick?: () => void;
}

const Title: React.FC<AssignmentCardTitleProps> = ({ onClick }) => {
  const { assignment, onToggle } = useAssignmentCardContext();

  return (
    <div className="assignment-card-title-row">
      <button
        type="button"
        className={`task-checkbox-btn ${assignment.completed ? 'checked' : ''}`}
        onClick={() => onToggle(assignment.id)}
        aria-label={
          assignment.completed
            ? 'Đánh dấu bài tập chưa hoàn thành'
            : 'Đánh dấu bài tập đã hoàn thành'
        }
      >
        {assignment.completed ? (
          <CheckCircle2 className="checkbox-icon checked" size={22} />
        ) : (
          <Circle className="checkbox-icon" size={22} />
        )}
      </button>

      <h3
        className={`assignment-card-title ${assignment.completed ? 'title-completed' : ''}`}
        onClick={onClick}
      >
        {assignment.title}
      </h3>
    </div>
  );
};

// ==========================================
// 5. Subcomponent: AssignmentCard.Priority
// ==========================================

export interface PriorityBadgeProps {
  priority?: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority: propPriority }) => {
  const { assignment } = useAssignmentCardContext();
  const priority = propPriority || assignment.priority;
  const config = PRIORITY_CONFIG[priority];

  const renderIcon = () => {
    switch (priority) {
      case 'HIGH':
        return <Flame size={13} className="priority-icon" />;
      case 'MEDIUM':
        return <AlertTriangle size={13} className="priority-icon" />;
      case 'LOW':
      default:
        return null;
    }
  };

  return (
    <span
      className={`priority-badge ${config.badgeClass}`}
      style={{
        color: config.color,
        borderColor: config.color,
        backgroundColor: config.bgLight,
      }}
    >
      {renderIcon()}
      <span>Ưu tiên: {config.label}</span>
    </span>
  );
};

// ==========================================
// 6. Subcomponent: AssignmentCard.Deadline
// ==========================================

const Deadline: React.FC = () => {
  const { assignment, deadlineInfo } = useAssignmentCardContext();

  const getStatusBadge = () => {
    if (assignment.completed) {
      return (
        <span className="deadline-badge badge-completed">
          <Check size={14} />
          Đã hoàn thành
        </span>
      );
    }

    if (deadlineInfo.isToday) {
      return (
        <span className="deadline-badge badge-today">
          <Clock size={14} />
          {deadlineInfo.label}
        </span>
      );
    }

    if (deadlineInfo.isOverdue) {
      return (
        <span className="deadline-badge badge-overdue">
          <AlertTriangle size={14} />
          {deadlineInfo.label}
        </span>
      );
    }

    return (
      <span className="deadline-badge badge-upcoming">
        <Clock size={14} />
        {deadlineInfo.label}
      </span>
    );
  };

  return (
    <div className="assignment-card-deadline-row">
      <div className="deadline-date-info">
        <Calendar size={15} className="calendar-icon" />
        <span className="deadline-text">Hạn: {deadlineInfo.formattedDeadline}</span>
      </div>
      <div className="deadline-status-container">{getStatusBadge()}</div>
    </div>
  );
};

// ==========================================
// 7. Subcomponent: AssignmentCard.Actions
// ==========================================

export interface AssignmentCardActionsProps {
  showDeleteConfirm?: boolean;
}

const Actions: React.FC<AssignmentCardActionsProps> = () => {
  const { assignment, onToggle, onDeleteRequest } = useAssignmentCardContext();

  return (
    <footer className="assignment-card-actions">
      <button
        type="button"
        className={`btn btn-sm ${
          assignment.completed ? 'btn-outline-secondary' : 'btn-outline-success'
        }`}
        onClick={() => onToggle(assignment.id)}
        aria-label={assignment.completed ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
      >
        {assignment.completed ? (
          <>
            <RotateCcw size={15} />
            <span>Chưa xong</span>
          </>
        ) : (
          <>
            <Check size={15} />
            <span>Hoàn thành</span>
          </>
        )}
      </button>

      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={() => onDeleteRequest(assignment)}
        aria-label={`Xoá bài tập ${assignment.title}`}
      >
        <Trash2 size={15} />
        <span>Xoá</span>
      </button>
    </footer>
  );
};

// ==========================================
// 8. Compound Component Assembly
// ==========================================

export const AssignmentCard = Object.assign(AssignmentCardRoot, {
  Header,
  Title,
  Priority: PriorityBadge,
  Deadline,
  Actions,
});
