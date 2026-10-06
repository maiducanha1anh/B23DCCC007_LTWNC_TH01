import React, { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import type { Assignment } from '../assignmentTypes';
import { AssignmentCard } from './AssignmentCard';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { withLoading } from '../../../components/common/withLoading';
import { useAppDispatch } from '../../../app/hooks';
import { toggleAssignment, deleteAssignment } from '../assignmentSlice';

export interface AssignmentListProps {
  assignments: Assignment[];
  onOpenAddModal?: () => void;
}

const AssignmentListBase: React.FC<AssignmentListProps> = ({
  assignments,
  onOpenAddModal,
}) => {
  const dispatch = useAppDispatch();
  const [targetToDelete, setTargetToDelete] = useState<Assignment | null>(null);

  const handleToggle = (id: string) => {
    dispatch(toggleAssignment(id));
  };

  const handleDeleteRequest = (assignment: Assignment) => {
    setTargetToDelete(assignment);
  };

  const handleConfirmDelete = () => {
    if (targetToDelete) {
      dispatch(deleteAssignment(targetToDelete.id));
      setTargetToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTargetToDelete(null);
  };

  // Empty state handling
  if (assignments.length === 0) {
    return (
      <div className="state-card empty-state">
        <div className="empty-icon-wrapper">
          <ClipboardList size={48} className="empty-icon" />
        </div>
        <h3 className="empty-title">Chưa có bài tập nào</h3>
        <p className="empty-description">
          Không tìm thấy bài tập phù hợp với bộ lọc hiện tại. Hãy thêm bài tập mới hoặc thay đổi bộ lọc.
        </p>
        {onOpenAddModal && (
          <button
            type="button"
            className="btn btn-primary empty-action-btn"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>Thêm bài tập mới</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="assignment-list-container">
      <div className="assignment-grid">
        {assignments.map((assignment) => (
          /* Using Compound Component pattern for AssignmentCard */
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onToggle={handleToggle}
            onDeleteRequest={handleDeleteRequest}
          >
            <AssignmentCard.Header />
            <AssignmentCard.Title />
            <AssignmentCard.Deadline />
            <AssignmentCard.Actions />
          </AssignmentCard>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={targetToDelete !== null}
        title="Xác nhận xoá bài tập"
        message={`Bạn có chắc chắn muốn xoá bài tập "${targetToDelete?.title}" khỏi danh sách theo dõi? Hành động này không thể hoàn tác.`}
        confirmLabel="Xoá vĩnh viễn"
        cancelLabel="Giữ lại"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

// Export base list and withLoading HOC-enhanced list
export const AssignmentList = AssignmentListBase;
export const AssignmentListWithLoading = withLoading(AssignmentListBase);
